const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");
const { URL } = require("url");

const ROOT = process.pkg ? path.dirname(process.execPath) : __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const CACHE_DIR = path.join(ROOT, "cache");
const ENV_FILE = path.join(ROOT, ".env");
const STARTUP_ERROR_LOG = path.join(ROOT, "startup-error.log");
const SYNC_CACHE_FILE = path.join(CACHE_DIR, "bunpro-sync.json");
const ANKI_CACHE_PREFIX = "anki-deck-";
const CSV_CACHE_PREFIX = "csv-file-";
const BUNPRO_BASE_URL = "https://api.bunpro.jp/api/frontend";
const ANKI_CONNECT_URL = process.env.ANKI_CONNECT_URL || "http://127.0.0.1:8765";
const APP_VERSION = "0.2.1";
const DEFAULT_LLM_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai";
const DEFAULT_LLM_MODEL = "gemini-3.5-flash";
const DEFAULT_FEEDBACK_LANGUAGE = "english";
const DEFAULT_PORT = 5174;
const MAX_FEEDBACK_LANGUAGE_LENGTH = 40;
const MAX_CUSTOM_INSTRUCTIONS_LENGTH = 800;
const MAX_CSV_BYTES = 2 * 1024 * 1024;
const MAX_CSV_ROWS = 5000;
const MAX_CSV_FIELD_LENGTH = 2000;
const MAX_CSV_HINT_LENGTH = 1200;
const MAX_CSV_PREVIEW_ROWS = 10;
const SRS_LEVELS = ["beginner", "adept", "seasoned", "expert", "master"];

process.on("uncaughtException", (error) => {
  writeStartupError(error);
  console.error(error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  writeStartupError(error);
  console.error(error);
  process.exit(1);
});

loadEnv(ENV_FILE);

const config = {
  port: Number(process.env.PORT || DEFAULT_PORT),
  host: process.env.HOST || "127.0.0.1",
  bunproToken: process.env.BUNPRO_API_TOKEN || "",
  llmBaseUrl: stripTrailingSlash(process.env.LLM_BASE_URL || process.env.OPENAI_BASE_URL || DEFAULT_LLM_BASE_URL),
  llmApiKey: process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || "",
  llmModel: process.env.LLM_MODEL || process.env.OPENAI_MODEL || DEFAULT_LLM_MODEL,
  feedbackLanguage: normalizeFeedbackLanguage(process.env.LLM_FEEDBACK_LANGUAGE || DEFAULT_FEEDBACK_LANGUAGE),
  customInstructions: limitCustomInstructions(process.env.LLM_CUSTOM_INSTRUCTIONS || "")
};

const state = {
  syncedAt: null,
  syncedAtDisplay: null,
  overview: null,
  grammarPoints: [],
  sentences: [],
  ankiImports: new Map(),
  csvImports: new Map(),
  grammarById: new Map(),
  hydrateCache: new Map()
};

loadSyncCache();
loadAnkiCache();
loadCsvCache();

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "GET" && url.pathname === "/api/status") {
      return sendJson(res, 200, {
        appVersion: APP_VERSION,
        hasBunproToken: Boolean(config.bunproToken),
        hasOpenAiKey: hasLlmCredentials(),
        hasLlmCredentials: hasLlmCredentials(),
        model: config.llmModel,
        llmBaseUrl: config.llmBaseUrl,
        feedbackLanguage: config.feedbackLanguage,
        customInstructions: config.customInstructions,
        syncedAt: state.syncedAt,
        syncedAtDisplay: state.syncedAtDisplay,
        ankiDecks: getAnkiImportSummaries(),
        csvFiles: getCsvImportSummaries(),
        ankiSyncedAt: getLatestAnkiImport()?.syncedAt || null,
        ankiSyncedAtDisplay: getLatestAnkiImport()?.syncedAtDisplay || null,
        ankiDeck: getLatestAnkiImport()?.deck || null,
        grammarPointCount: state.grammarPoints.length,
        bunproSentenceCount: state.sentences.length,
        ankiSentenceCount: getAnkiSentences().length,
        csvSentenceCount: getCsvSentences().length,
        sentenceCount: getAllSentences().length,
        jlptLevels: getAvailableJlptLevels(),
        practiceFilters: getPracticeFilters(),
        overview: state.overview
      });
    }

    if (req.method === "POST" && url.pathname === "/api/sync") {
      const result = await syncBunpro();
      return sendJson(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/api/settings") {
      const body = await readJson(req);
      const result = saveSettings(body);
      return sendJson(res, 200, result);
    }

    if (req.method === "GET" && url.pathname === "/api/sentences") {
      if (getAllSentences().length === 0 && config.bunproToken) {
        await syncBunpro();
      }
      return sendJson(res, 200, {
        sentences: getClientSentences(),
        jlptLevels: getAvailableJlptLevels(),
        practiceFilters: getPracticeFilters()
      });
    }

    if (req.method === "GET" && url.pathname === "/api/random") {
      if (getAllSentences().length === 0 && config.bunproToken) {
        await syncBunpro();
      }
      const sentences = getAllSentences();
      if (sentences.length === 0) {
        return sendJson(res, 404, { error: "No sentences loaded yet." });
      }
      const sentence = chooseRandom(sentences);
      return sendJson(res, 200, { sentence: prepareSentenceForClient(sentence) });
    }

    if (req.method === "GET" && url.pathname === "/api/anki/decks") {
      const decks = await getAnkiDecks();
      return sendJson(res, 200, { decks });
    }

    if (req.method === "POST" && url.pathname === "/api/anki/fields") {
      const body = await readJson(req);
      const result = await getAnkiFields(body);
      return sendJson(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/api/anki/preview") {
      const body = await readJson(req);
      const result = await previewAnkiImport(body);
      return sendJson(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/api/anki/import") {
      const body = await readJson(req);
      const result = await importAnkiSentences(body);
      return sendJson(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/api/csv/preview") {
      const body = await readJson(req);
      const result = previewCsvImport(body);
      return sendJson(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/api/csv/import") {
      const body = await readJson(req);
      const result = importCsvSentences(body);
      return sendJson(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/api/grade") {
      const body = await readJson(req);
      const result = await gradeAnswer(body);
      return sendJson(res, 200, result);
    }

    return serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    return sendJson(res, error.statusCode || 500, {
      error: error.publicMessage || "Something went wrong.",
      detail: error.publicDetail || undefined
    });
  }
});

server.on("error", handleServerError);
startServer(config.port);

function startServer(port) {
  config.port = port;
  server.listen(config.port, config.host, () => {
    const appUrl = `http://${config.host}:${config.port}`;
    console.log(`Japanese Full Sentence Trainer running at ${appUrl}`);
    openBrowser(appUrl);
  });
}

function handleServerError(error) {
  const canTryNextPort = error.code === "EADDRINUSE"
    && !process.env.PORT
    && config.port < DEFAULT_PORT + 20;
  if (canTryNextPort) {
    startServer(config.port + 1);
    return;
  }

  writeStartupError(error);
  console.error(error);
  process.exitCode = 1;
}

function openBrowser(appUrl) {
  if (process.env.OPEN_BROWSER === "0" || process.env.NO_OPEN_BROWSER === "1") return;

  const command = process.platform === "darwin"
    ? "open"
    : process.platform === "win32"
      ? "cmd"
      : "xdg-open";
  const args = process.platform === "win32"
    ? ["/c", "start", "", appUrl]
    : [appUrl];

  const child = spawn(command, args, {
    detached: true,
    stdio: "ignore"
  });
  child.on("error", () => {
    console.log(`Open this address in your browser: ${appUrl}`);
  });
  child.unref();
}

function writeStartupError(error) {
  try {
    const timestamp = new Date().toISOString();
    const message = error?.stack || error?.message || String(error);
    fs.appendFileSync(STARTUP_ERROR_LOG, `[${timestamp}]\n${message}\n\n`);
  } catch {
    // If logging fails, still let the original error surface in the console.
  }
}

async function syncBunpro() {
  requireBunproToken();

  const overview = await bunproGet("/user_stats/srs_level_overview");
  const levelsToFetch = SRS_LEVELS.filter((level) => {
    const count = Number(overview?.grammar?.[level] || 0);
    return count > 0;
  });

  const summariesById = new Map();
  const reviewsByLevel = {};

  for (const level of levelsToFetch) {
    const firstPage = await fetchSrsLevel(level, 1);
    reviewsByLevel[level] = {
      count: firstPage.pagy?.count || 0,
      pages: firstPage.pagy?.pages || 1
    };
    collectGrammarSummaries(firstPage, summariesById);

    const totalPages = Number(firstPage.pagy?.pages || 1);
    for (let page = 2; page <= totalPages; page += 1) {
      const pageData = await fetchSrsLevel(level, page);
      collectGrammarSummaries(pageData, summariesById);
    }
  }

  const summaries = Array.from(summariesById.values()).sort((a, b) => a.id - b.id);
  const hydrated = [];
  const sentences = [];

  for (const summary of summaries) {
    const grammarPoint = await hydrateGrammarPoint(summary);
    hydrated.push(grammarPoint);
    for (const sentence of grammarPoint.sentences) {
      sentences.push(sentence);
    }
  }

  state.syncedAt = new Date().toISOString();
  state.syncedAtDisplay = formatLocalTimestamp(state.syncedAt);
  state.overview = overview;
  state.grammarPoints = hydrated;
  state.sentences = sentences;
  state.grammarById = new Map(hydrated.map((point) => [String(point.id), point]));

  const result = {
    syncedAt: state.syncedAt,
    syncedAtDisplay: state.syncedAtDisplay,
    overview,
    fetchedLevels: reviewsByLevel,
    grammarPointCount: hydrated.length,
    sentenceCount: sentences.length,
    jlptLevels: getAvailableJlptLevels(),
    practiceFilters: getPracticeFilters()
  };
  saveSyncCache();
  return result;
}

function saveSettings(body) {
  const updates = {};

  const bunproToken = trimString(body?.bunproToken);
  if (bunproToken) {
    updates.BUNPRO_API_TOKEN = bunproToken;
    config.bunproToken = bunproToken;
    process.env.BUNPRO_API_TOKEN = bunproToken;
  }

  const llmBaseUrl = stripTrailingSlash(trimString(body?.llmBaseUrl));
  if (llmBaseUrl) {
    updates.LLM_BASE_URL = llmBaseUrl;
    config.llmBaseUrl = llmBaseUrl;
    process.env.LLM_BASE_URL = llmBaseUrl;
  }

  const llmApiKey = trimString(body?.llmApiKey);
  if (llmApiKey) {
    updates.LLM_API_KEY = llmApiKey;
    config.llmApiKey = llmApiKey;
    process.env.LLM_API_KEY = llmApiKey;
  }

  const llmModel = trimString(body?.llmModel);
  if (llmModel) {
    updates.LLM_MODEL = llmModel;
    config.llmModel = llmModel;
    process.env.LLM_MODEL = llmModel;
  }

  if (Object.prototype.hasOwnProperty.call(body || {}, "feedbackLanguage")) {
    const feedbackLanguage = normalizeFeedbackLanguage(body.feedbackLanguage);
    updates.LLM_FEEDBACK_LANGUAGE = feedbackLanguage;
    config.feedbackLanguage = feedbackLanguage;
    process.env.LLM_FEEDBACK_LANGUAGE = feedbackLanguage;
  }

  if (Object.prototype.hasOwnProperty.call(body || {}, "customInstructions")) {
    const customInstructions = limitCustomInstructions(body.customInstructions);
    updates.LLM_CUSTOM_INSTRUCTIONS = customInstructions;
    config.customInstructions = customInstructions;
    process.env.LLM_CUSTOM_INSTRUCTIONS = customInstructions;
  }

  if (Object.keys(updates).length === 0) {
    const err = new Error("No settings to save.");
    err.statusCode = 400;
    err.publicMessage = "Enter at least one setting before saving.";
    throw err;
  }

  writeEnvUpdates(updates);
  return {
    hasBunproToken: Boolean(config.bunproToken),
    hasLlmCredentials: hasLlmCredentials(),
    model: config.llmModel,
    llmBaseUrl: config.llmBaseUrl,
    feedbackLanguage: config.feedbackLanguage,
    customInstructions: config.customInstructions
  };
}

async function getAnkiDecks() {
  const decks = await ankiConnect("deckNames");
  return Array.isArray(decks) ? decks.sort((a, b) => a.localeCompare(b)) : [];
}

async function getAnkiFields(body) {
  const deck = requireNonEmptyString(body?.deck, "Anki deck is required.");
  const noteIds = await findAnkiNotes(deck);
  const sampleNotes = await getAnkiNotes(noteIds.slice(0, 100));
  const fields = collectAnkiFieldNames(sampleNotes);
  return {
    deck,
    noteCount: noteIds.length,
    fields
  };
}

async function previewAnkiImport(body) {
  const deck = requireNonEmptyString(body?.deck, "Anki deck is required.");
  const englishField = requireNonEmptyString(body?.englishField, "English field is required.");
  const japaneseField = requireNonEmptyString(body?.japaneseField, "Japanese field is required.");
  const grammarHintField = String(body?.grammarHintField || "").trim();
  const noteIds = await findAnkiNotes(deck);
  const notes = await getAnkiNotes(noteIds.slice(0, 200));
  const normalizedSentences = normalizeAnkiNotes(notes, { deck, englishField, japaneseField, grammarHintField });
  const sentences = normalizedSentences.slice(0, 10);
  return {
    deck,
    noteCount: noteIds.length,
    checkedNoteCount: notes.length,
    usableSentenceCount: normalizedSentences.length,
    skippedSentenceCount: Math.max(0, notes.length - normalizedSentences.length),
    selectedFields: {
      englishField,
      japaneseField,
      grammarHintField
    },
    samples: buildAnkiPreviewSamples(notes, { englishField, japaneseField, grammarHintField }),
    preview: sentences.map((sentence) => ({
      id: sentence.id,
      english: sentence.english,
      japanese: sentence.japanese
    }))
  };
}

async function importAnkiSentences(body) {
  const deck = requireNonEmptyString(body?.deck, "Anki deck is required.");
  const englishField = requireNonEmptyString(body?.englishField, "English field is required.");
  const japaneseField = requireNonEmptyString(body?.japaneseField, "Japanese field is required.");
  const grammarHintField = String(body?.grammarHintField || "").trim();
  const noteIds = await findAnkiNotes(deck);
  const sentences = [];

  for (let i = 0; i < noteIds.length; i += 100) {
    const notes = await getAnkiNotes(noteIds.slice(i, i + 100));
    sentences.push(...normalizeAnkiNotes(notes, { deck, englishField, japaneseField, grammarHintField }));
  }

  const syncedAt = new Date().toISOString();
  const deckImport = {
    deck,
    syncedAt,
    syncedAtDisplay: formatLocalTimestamp(syncedAt),
    englishField,
    japaneseField,
    grammarHintField: grammarHintField || "",
    sentences: dedupeSentences(sentences)
  };
  state.ankiImports.set(deck, deckImport);
  saveAnkiCache(deck);

  return {
    deck,
    noteCount: noteIds.length,
    importedSentenceCount: deckImport.sentences.length,
    ankiSyncedAt: deckImport.syncedAt,
    ankiSyncedAtDisplay: deckImport.syncedAtDisplay,
    sentenceCount: getAllSentences().length,
    grammarPointCount: state.grammarPoints.length,
    jlptLevels: getAvailableJlptLevels(),
    practiceFilters: getPracticeFilters()
  };
}

function previewCsvImport(body) {
  const sourceName = normalizeCsvSourceName(body?.fileName || body?.sourceName || "CSV import");
  const parsed = parseCsvImport(body?.csvText, { requireColumns: false });
  const columns = parsed.headers.map((header, index) => ({
    index,
    label: header || `Column ${index + 1}`
  }));
  const englishColumn = getRequestedCsvColumn(body?.englishColumn, columns.length)
    ?? chooseLikelyColumn(columns, ["english", "en", "translation", "meaning", "front"]);
  const japaneseColumn = getRequestedCsvColumn(body?.japaneseColumn, columns.length)
    ?? chooseLikelyColumn(columns, ["japanese", "jp", "ja", "sentence", "expression", "back"]);
  const requestedHintColumn = Object.prototype.hasOwnProperty.call(body || {}, "hintColumn") && body.hintColumn !== ""
    ? getRequestedCsvColumn(body.hintColumn, columns.length, { allowNone: true })
    : null;
  const hintColumn = requestedHintColumn ?? chooseLikelyColumn(columns, ["hint", "grammar", "note", "explanation"]);
  const options = {
    sourceName,
    englishColumn,
    japaneseColumn,
    hintColumn
  };
  const normalized = englishColumn !== -1 && japaneseColumn !== -1
    ? normalizeCsvRows(parsed.rows, options)
    : { sentences: [], skippedRowCount: parsed.rows.length, truncatedFieldCount: 0 };

  return {
    sourceName,
    hasHeader: parsed.hasHeader,
    rowCount: parsed.rows.length,
    checkedRowCount: parsed.rows.length,
    usableSentenceCount: normalized.sentences.length,
    skippedRowCount: normalized.skippedRowCount,
    truncatedFieldCount: normalized.truncatedFieldCount,
    columns,
    selectedColumns: {
      englishColumn,
      japaneseColumn,
      hintColumn
    },
    preview: normalized.sentences.slice(0, MAX_CSV_PREVIEW_ROWS).map((sentence) => ({
      id: sentence.id,
      english: sentence.english,
      japanese: sentence.japanese,
      grammarHint: sentence.grammarHint
    }))
  };
}

function importCsvSentences(body) {
  const sourceName = normalizeCsvSourceName(body?.sourceName || body?.fileName || "CSV import");
  const englishColumn = Number(body?.englishColumn);
  const japaneseColumn = Number(body?.japaneseColumn);
  const hintColumn = body?.hintColumn === "" || body?.hintColumn == null ? -1 : Number(body.hintColumn);
  const parsed = parseCsvImport(body?.csvText, { requireColumns: true });
  const normalized = normalizeCsvRows(parsed.rows, {
    sourceName,
    englishColumn,
    japaneseColumn,
    hintColumn
  });
  if (normalized.sentences.length === 0) {
    const err = new Error("No usable CSV sentence pairs found.");
    err.statusCode = 400;
    err.publicMessage = "No usable CSV sentence pairs found.";
    err.publicDetail = "Choose columns that contain both English and Japanese text.";
    throw err;
  }

  const syncedAt = new Date().toISOString();
  const csvImport = {
    sourceName,
    syncedAt,
    syncedAtDisplay: formatLocalTimestamp(syncedAt),
    englishColumn,
    japaneseColumn,
    hintColumn,
    sentenceCount: normalized.sentences.length,
    skippedRowCount: normalized.skippedRowCount,
    truncatedFieldCount: normalized.truncatedFieldCount,
    sentences: dedupeSentences(normalized.sentences)
  };
  state.csvImports.set(sourceName, csvImport);
  saveCsvCache(sourceName);

  return {
    sourceName,
    importedSentenceCount: csvImport.sentences.length,
    skippedRowCount: normalized.skippedRowCount,
    truncatedFieldCount: normalized.truncatedFieldCount,
    csvSyncedAt: csvImport.syncedAt,
    csvSyncedAtDisplay: csvImport.syncedAtDisplay,
    sentenceCount: getAllSentences().length,
    practiceFilters: getPracticeFilters()
  };
}

async function findAnkiNotes(deck) {
  return ankiConnect("findNotes", { query: `deck:${quoteAnkiQuery(deck)}` });
}

async function getAnkiNotes(noteIds) {
  if (!Array.isArray(noteIds) || noteIds.length === 0) return [];
  return ankiConnect("notesInfo", { notes: noteIds });
}

async function ankiConnect(action, params = {}) {
  let response;
  try {
    response = await fetch(ANKI_CONNECT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, version: 6, params })
    });
  } catch (error) {
    const err = new Error(`AnkiConnect request failed: ${action}`);
    err.statusCode = 502;
    err.publicMessage = "AnkiConnect request failed.";
    err.publicDetail = "Make sure Anki is open, AnkiConnect is installed, and ANKI_CONNECT_URL is correct.";
    throw err;
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.error) {
    const err = new Error(`AnkiConnect request failed: ${action}`);
    err.statusCode = response.ok ? 502 : response.status;
    err.publicMessage = "AnkiConnect request failed.";
    err.publicDetail = payload.error || response.statusText || "Make sure Anki is open and the AnkiConnect add-on is installed.";
    throw err;
  }
  return payload.result;
}

function collectAnkiFieldNames(notes) {
  const fields = new Set();
  for (const note of notes) {
    for (const fieldName of Object.keys(note?.fields || {})) {
      fields.add(fieldName);
    }
  }
  return Array.from(fields).sort((a, b) => a.localeCompare(b));
}

function normalizeAnkiNotes(notes, options) {
  const sentences = [];
  for (const note of notes) {
    const english = cleanAnkiField(getAnkiFieldValue(note, options.englishField));
    const japanese = cleanAnkiField(getAnkiFieldValue(note, options.japaneseField));
    const grammarHint = options.grammarHintField
      ? cleanAnkiField(getAnkiFieldValue(note, options.grammarHintField))
      : "";
    if (!english || !japanese) continue;
    sentences.push({
      id: `anki:${note.noteId}`,
      source: "anki",
      sourceLabel: options.deck,
      sourceContext: `From ${options.deck} deck`,
      ankiDeck: options.deck,
      grammarPointId: `anki:${options.deck}`,
      grammarTitle: "",
      grammarSlug: "anki",
      grammarMeaning: grammarHint,
      grammarHint,
      jlptLevel: "",
      practiceFilterId: getAnkiPracticeFilterId(options.deck),
      practiceFilterLabel: `Anki ${options.deck}`,
      english,
      japanese,
      answer: "",
      questionType: "anki",
      audio: {
        male: "",
        female: ""
      }
    });
  }
  return sentences;
}

function buildAnkiPreviewSamples(notes, options) {
  return notes.slice(0, 5).map((note) => ({
    noteId: note.noteId,
    english: cleanAnkiField(getAnkiFieldValue(note, options.englishField)).slice(0, 180),
    japanese: cleanAnkiField(getAnkiFieldValue(note, options.japaneseField)).slice(0, 180),
    grammarHint: options.grammarHintField
      ? cleanAnkiField(getAnkiFieldValue(note, options.grammarHintField)).slice(0, 180)
      : "",
    availableFields: Object.keys(note?.fields || {})
  }));
}

function getAnkiFieldValue(note, fieldName) {
  if (!fieldName) return "";
  const field = note?.fields?.[fieldName];
  if (field == null) return "";
  if (typeof field === "string") return field;
  if (typeof field.value === "string") return field.value;
  if (typeof field.value === "number") return String(field.value);
  if (typeof field.text === "string") return field.text;
  return "";
}

function cleanAnkiField(value) {
  return stripHtml(String(value || "")
    .replace(/\[sound:[^\]]+\]/g, "")
    .replace(/{{c\d+::(.*?)(?:::.*?)?}}/g, "$1"));
}

function parseCsvImport(csvText) {
  const text = String(csvText || "").replace(/^\uFEFF/, "");
  if (!text.trim()) {
    const err = new Error("CSV file is empty.");
    err.statusCode = 400;
    err.publicMessage = "CSV file is empty.";
    throw err;
  }
  if (Buffer.byteLength(text, "utf8") > MAX_CSV_BYTES) {
    const err = new Error("CSV file is too large.");
    err.statusCode = 400;
    err.publicMessage = "CSV file is too large.";
    err.publicDetail = "Use a CSV smaller than 2 MB.";
    throw err;
  }

  const rows = parseCsvRows(text)
    .map((row) => row.map((cell) => String(cell || "").trim()))
    .filter((row) => row.some(Boolean));
  if (rows.length < 2) {
    const err = new Error("CSV needs a header row and at least one data row.");
    err.statusCode = 400;
    err.publicMessage = "CSV needs a header row and at least one data row.";
    throw err;
  }
  if (rows.length - 1 > MAX_CSV_ROWS) {
    const err = new Error("CSV has too many rows.");
    err.statusCode = 400;
    err.publicMessage = "CSV has too many rows.";
    err.publicDetail = `Import at most ${MAX_CSV_ROWS} data rows at a time.`;
    throw err;
  }

  const headers = rows[0].map((header, index) => header || `Column ${index + 1}`);
  return {
    hasHeader: true,
    headers,
    rows: rows.slice(1)
  };
}

function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (inQuotes) {
      if (char === "\"" && next === "\"") {
        cell += "\"";
        index += 1;
      } else if (char === "\"") {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === "\"") {
      inQuotes = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);
  return rows;
}

function normalizeCsvRows(rows, options) {
  const englishColumn = Number(options.englishColumn);
  const japaneseColumn = Number(options.japaneseColumn);
  const hintColumn = Number(options.hintColumn);
  const sentences = [];
  let skippedRowCount = 0;
  let truncatedFieldCount = 0;

  if (!Number.isInteger(englishColumn) || !Number.isInteger(japaneseColumn) || englishColumn < 0 || japaneseColumn < 0) {
    return { sentences, skippedRowCount: rows.length, truncatedFieldCount };
  }

  rows.forEach((row, index) => {
    const english = sanitizeCsvField(row[englishColumn], MAX_CSV_FIELD_LENGTH);
    const japanese = sanitizeCsvField(row[japaneseColumn], MAX_CSV_FIELD_LENGTH);
    const hint = hintColumn >= 0 ? sanitizeCsvField(row[hintColumn], MAX_CSV_HINT_LENGTH) : { text: "", truncated: false };
    truncatedFieldCount += Number(english.truncated) + Number(japanese.truncated) + Number(hint.truncated);

    if (!english.text || !japanese.text) {
      skippedRowCount += 1;
      return;
    }

    sentences.push({
      id: `csv:${encodeFileToken(options.sourceName)}:${index + 1}`,
      source: "csv",
      sourceLabel: options.sourceName,
      sourceContext: `From ${options.sourceName} CSV`,
      csvSourceName: options.sourceName,
      grammarPointId: `csv:${options.sourceName}`,
      grammarTitle: "",
      grammarSlug: "csv",
      grammarMeaning: hint.text,
      grammarHint: hint.text,
      jlptLevel: "",
      practiceFilterId: getCsvPracticeFilterId(options.sourceName),
      practiceFilterLabel: `CSV ${options.sourceName}`,
      english: english.text,
      japanese: japanese.text,
      answer: "",
      questionType: "csv",
      audio: {
        male: "",
        female: ""
      }
    });
  });

  return { sentences, skippedRowCount, truncatedFieldCount };
}

function sanitizeCsvField(value, maxLength) {
  const text = stripHtml(String(value || ""))
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return { text, truncated: false };
  return { text: text.slice(0, maxLength).trim(), truncated: true };
}

function normalizeCsvSourceName(value) {
  return path.basename(String(value || "CSV import").trim() || "CSV import").slice(0, 120);
}

function chooseLikelyColumn(columns, candidates) {
  const option = columns.find((column) => {
    const label = column.label.toLowerCase();
    return candidates.some((candidate) => label.includes(candidate));
  });
  return option ? option.index : -1;
}

function getRequestedCsvColumn(value, columnCount, options = {}) {
  if (value === "" || value == null) return null;
  const index = Number(value);
  if (options.allowNone && index === -1) return -1;
  if (!Number.isInteger(index) || index < 0 || index >= columnCount) return null;
  return index;
}

function quoteAnkiQuery(value) {
  return `"${String(value || "").replace(/"/g, "\\\"")}"`;
}

function requireNonEmptyString(value, message) {
  const text = String(value || "").trim();
  if (text) return text;
  const err = new Error(message);
  err.statusCode = 400;
  err.publicMessage = message;
  throw err;
}

async function fetchSrsLevel(level, page) {
  const query = new URLSearchParams({
    level,
    reviewable_type: "Grammar",
    page: String(page)
  });
  return bunproGet(`/user_stats/srs_level_details?${query}`);
}

function collectGrammarSummaries(payload, summariesById) {
  const included = payload?.reviews?.included || [];
  for (const item of included) {
    const attrs = item.attributes || {};
    if (attrs.type_snake !== "grammar_point") continue;
    summariesById.set(String(attrs.id), {
      id: attrs.id,
      slug: attrs.slug,
      title: attrs.title,
      meaning: attrs.meaning,
      level: attrs.level
    });
  }
}

async function hydrateGrammarPoint(summary) {
  const cacheKey = String(summary.id || summary.slug);
  if (state.hydrateCache.has(cacheKey)) {
    return state.hydrateCache.get(cacheKey);
  }

  const payload = await bunproGet(`/reviewables/grammar_point/${encodeURIComponent(cacheKey)}`, {
    auth: false
  });
  const attrs = payload.data?.attributes || {};
  const studyQuestions = (payload.included || []).filter((item) => item.type === "study_question");

  const grammarPoint = {
    id: attrs.id || summary.id,
    slug: attrs.slug || summary.slug,
    title: attrs.title || summary.title,
    meaning: stripHtml(attrs.meaning || summary.meaning || ""),
    level: attrs.level || summary.level || "",
    sentences: studyQuestions
      .map((item) => normalizeStudyQuestion(item, attrs, summary))
      .filter(Boolean)
  };

  state.hydrateCache.set(cacheKey, grammarPoint);
  return grammarPoint;
}

function normalizeStudyQuestion(item, grammarAttrs, summary) {
  const attrs = item.attributes || {};
  if (!attrs.content || !attrs.translation) return null;

  const japanese = reconstructJapanese(attrs.content, attrs.answer || attrs.kanji_answer || "");
  if (!japanese) return null;

  return {
    id: String(attrs.id || item.id),
    source: "bunpro",
    sourceLabel: "Bunpro",
    sourceContext: "From Bunpro",
    grammarPointId: String(grammarAttrs.id || summary.id),
    grammarTitle: grammarAttrs.title || summary.title,
    grammarSlug: grammarAttrs.slug || summary.slug,
    grammarMeaning: stripHtml(grammarAttrs.meaning || summary.meaning || ""),
    jlptLevel: grammarAttrs.level || summary.level || "",
    practiceFilterId: getBunproPracticeFilterId(grammarAttrs.level || summary.level || ""),
    practiceFilterLabel: `Bunpro ${formatJlptLabel(grammarAttrs.level || summary.level || "")}`,
    english: stripHtml(attrs.translation || ""),
    japanese,
    answer: attrs.answer || "",
    questionType: attrs.question_type || "",
    audio: {
      male: attrs.male_audio_url || "",
      female: attrs.female_audio_url || ""
    }
  };
}

function reconstructJapanese(content, answer) {
  const plain = stripHtml(content)
    .replace(/\s+/g, "")
    .trim();
  return plain.replace(/_{2,}/g, answer).trim();
}

async function gradeAnswer(body) {
  if (!hasLlmCredentials()) {
    const err = new Error("LLM API key is not configured.");
    err.statusCode = 400;
    err.publicMessage = "Set LLM_API_KEY in .env before grading, or use a local LLM_BASE_URL that does not require a key.";
    throw err;
  }

  const sentence = body?.sentence || {};
  const userAnswer = String(body?.answer || "").trim();
  if (!sentence.english || !sentence.japanese || !userAnswer) {
    const err = new Error("Missing grading input.");
    err.statusCode = 400;
    err.publicMessage = "A sentence and non-empty answer are required.";
    throw err;
  }

  const feedbackLanguageLabel = getFeedbackLanguageLabel(config.feedbackLanguage);
  const prompt = {
    task: "Grade a Japanese learner's translation attempt.",
    responsePreferences: {
      feedbackLanguage: feedbackLanguageLabel,
      customInstructions: config.customInstructions
    },
    targetGrammar: {
      title: sentence.grammarTitle,
      meaning: sentence.grammarMeaning,
      jlptLevel: sentence.jlptLevel
    },
    englishPrompt: sentence.english,
    bunproReferenceJapanese: sentence.japanese,
    learnerJapanese: userAnswer,
    gradingRules: [
      "Accept natural Japanese that expresses the English prompt, even if it is not word-for-word identical to the reference.",
      "The learner answer should use the target grammar point or an equivalent form appropriate for the prompt.",
      "Do not require the exact same nouns, pronouns, or word order when the meaning remains correct.",
      "Use a coarse 0-10 score. Give 10 for fully correct, natural answers, even when they differ from the reference.",
      "Do not lower the score only because the learner omitted final Japanese punctuation such as 。 or ？. If a question correctly uses か, a missing final question mark must not affect the grade.",
      "Use 9 for correct answers with very small nuance, style, punctuation, or spelling issues.",
      "Use 7-8 for close answers that communicate the idea but have a noticeable grammar or naturalness issue.",
      "Use 0-6 for answers with wrong meaning, missing target grammar, or major grammar problems.",
      "Reject answers with major grammar errors, wrong meaning, or missing target grammar.",
      "Return concise feedback suitable for a learner.",
      `Write feedback and any learner-facing explanation in ${feedbackLanguageLabel}.`,
      `Do not write learner-facing feedback in English or Japanese unless the requested feedback language is English or Japanese.`,
      "Keep JSON object keys in English, regardless of feedback language.",
      "correctedJapanese and acceptedJapaneseAnswers must always be Japanese text.",
      "Follow customInstructions only when they do not conflict with these grading rules, the response schema, or the JSON-only requirement.",
      "Also return acceptedJapaneseAnswers for a no-API drill step. Include the Bunpro reference, the corrected/natural answer, and reasonable kana/kanji/furigana-free variants of those answers.",
      "acceptedJapaneseAnswers should be complete Japanese sentences only, not explanations. Do not include incorrect learner answers unless they are genuinely acceptable."
    ],
    responseSchema: {
      verdict: "correct | close | incorrect",
      score: "integer from 0 to 10",
      feedback: "short learner-facing explanation",
      correctedJapanese: "natural corrected answer, if needed",
      acceptedJapaneseAnswers: "array of acceptable full-sentence Japanese answers for exact local drill checking, including kana/kanji variants",
      notes: "brief internal rationale"
    }
  };

  const response = await fetch(buildLlmUrl("/chat/completions"), {
    method: "POST",
    headers: createLlmHeaders(),
    body: JSON.stringify({
      model: config.llmModel,
      messages: [
        {
          role: "system",
          content: `You are a careful Japanese grammar tutor. Write all learner-facing feedback in ${feedbackLanguageLabel}. Do not use English or Japanese for learner-facing feedback unless that is the requested feedback language. Missing final Japanese punctuation such as 。 or ？ should not affect the grade when the answer is otherwise correct. If a question correctly uses か, do not penalize a missing final question mark. Reply only with one valid JSON object. Do not wrap it in Markdown.`
        },
        {
          role: "user",
          content: JSON.stringify(prompt, null, 2)
        }
      ],
      temperature: 0.2
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error("LLM grading failed.");
    err.statusCode = response.status;
    err.publicMessage = "LLM grading failed.";
    err.publicDetail = payload.error?.message || response.statusText;
    throw err;
  }

  const text = getChatCompletionText(payload);
  const result = normalizeGradingResult(parseJsonObject(text));
  result.acceptedJapaneseAnswers = uniqueNonEmptyStrings([
    ...(Array.isArray(result.acceptedJapaneseAnswers) ? result.acceptedJapaneseAnswers : []),
    sentence.japanese,
    result.correctedJapanese
  ]);
  return result;
}

function hasLlmCredentials() {
  return Boolean(config.llmApiKey) || isLocalLlmBaseUrl(config.llmBaseUrl);
}

function createLlmHeaders() {
  const headers = {
    "Content-Type": "application/json"
  };
  if (config.llmApiKey) {
    headers.Authorization = `Bearer ${config.llmApiKey}`;
  }
  return headers;
}

function buildLlmUrl(pathname) {
  return `${config.llmBaseUrl}${pathname}`;
}

function isLocalLlmBaseUrl(baseUrl) {
  try {
    const url = new URL(baseUrl);
    return ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return false;
  }
}

function stripTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

function normalizeFeedbackLanguage(value) {
  const text = limitFeedbackLanguage(value);
  const normalized = text.toLowerCase();
  if (normalized === "japanese") return "japanese";
  if (normalized && normalized !== "english") return text;
  return "english";
}

function getFeedbackLanguageLabel(value) {
  const language = normalizeFeedbackLanguage(value);
  if (language === "japanese") return "Japanese";
  if (language === "english") return "English";
  return language;
}

function limitFeedbackLanguage(value) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[<>{}\[\]`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_FEEDBACK_LANGUAGE_LENGTH)
    .trim();
}

function limitCustomInstructions(value) {
  return String(value || "").trim().slice(0, MAX_CUSTOM_INSTRUCTIONS_LENGTH);
}

function getChatCompletionText(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => part?.text || part?.content || "")
      .join("")
      .trim();
  }
  return "";
}

function parseJsonObject(text) {
  const raw = String(text || "").trim();
  if (!raw) {
    throwInvalidLlmJson("The model returned an empty response.");
  }

  try {
    return JSON.parse(raw);
  } catch {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      try {
        return JSON.parse(fenced[1].trim());
      } catch {
        // Fall through to object extraction.
      }
    }

    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1));
      } catch {
        // Fall through to public error.
      }
    }
  }

  throwInvalidLlmJson("The model did not return valid grading JSON.");
}

function throwInvalidLlmJson(detail) {
  const err = new Error(detail);
  err.statusCode = 502;
  err.publicMessage = "LLM grading failed.";
  err.publicDetail = `${detail} Try a stronger model or a model that follows JSON instructions reliably.`;
  throw err;
}

function normalizeGradingResult(result) {
  const score = clampScore(result?.score);
  const verdict = normalizeVerdict(result?.verdict, score);
  return {
    verdict,
    score,
    feedback: String(result?.feedback || ""),
    correctedJapanese: String(result?.correctedJapanese || ""),
    acceptedJapaneseAnswers: Array.isArray(result?.acceptedJapaneseAnswers)
      ? result.acceptedJapaneseAnswers
      : [],
    notes: String(result?.notes || "")
  };
}

function clampScore(score) {
  const numericScore = Number(score);
  if (!Number.isFinite(numericScore)) return 0;
  return Math.max(0, Math.min(10, Math.round(numericScore)));
}

function normalizeVerdict(verdict, score) {
  const value = String(verdict || "").trim().toLowerCase();
  if (["correct", "close", "incorrect"].includes(value)) return value;
  if (score >= 9) return "correct";
  if (score >= 7) return "close";
  return "incorrect";
}

async function bunproGet(pathname, options = {}) {
  const useAuth = options.auth !== false;
  const headers = {
    Accept: "application/json",
    Origin: "https://bunpro.jp",
    Referer: "https://bunpro.jp/"
  };
  if (useAuth) {
    requireBunproToken();
    headers.Authorization = `Token token=${config.bunproToken}`;
  }

  const response = await fetch(`${BUNPRO_BASE_URL}${pathname}`, { headers });
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const err = new Error(`Bunpro request failed: ${pathname}`);
    err.statusCode = response.status;
    err.publicMessage = "Bunpro request failed.";
    err.publicDetail = payload?.errors?.[0]?.code || payload?.errors?.[0]?.detail || text.slice(0, 200);
    throw err;
  }

  return payload;
}

function requireBunproToken() {
  if (config.bunproToken) return;
  const err = new Error("Bunpro token is not configured.");
  err.statusCode = 400;
  err.publicMessage = "Set BUNPRO_API_TOKEN in .env before syncing.";
  throw err;
}

function stripHtml(value) {
  return decodeEntities(String(value || ""))
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function chooseRandom(items) {
  return items[Math.floor(Math.random() * items.length)] || null;
}

function uniqueNonEmptyStrings(values) {
  const seen = new Set();
  const unique = [];
  for (const value of values) {
    const text = String(value || "").trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    unique.push(text);
  }
  return unique;
}

function trimString(value) {
  return String(value || "").trim();
}

function getAvailableJlptLevels() {
  const levels = new Set();
  for (const sentence of state.sentences) {
    const level = normalizeJlptLevel(sentence.jlptLevel);
    if (level) levels.add(level);
  }
  return Array.from(levels).sort(compareJlptLevels);
}

function getAllSentences() {
  return [...state.sentences, ...getAnkiSentences(), ...getCsvSentences()];
}

function getClientSentences() {
  return getAllSentences().map(prepareSentenceForClient);
}

function getAnkiSentences() {
  return getAnkiImports().flatMap((deckImport) => deckImport.sentences);
}

function getCsvSentences() {
  return getCsvImports().flatMap((csvImport) => csvImport.sentences);
}

function getAnkiImports() {
  return Array.from(state.ankiImports.values()).sort((a, b) => a.deck.localeCompare(b.deck));
}

function getCsvImports() {
  return Array.from(state.csvImports.values()).sort((a, b) => a.sourceName.localeCompare(b.sourceName));
}

function getLatestAnkiImport() {
  return getAnkiImports()
    .filter((deckImport) => deckImport.syncedAt)
    .sort((a, b) => new Date(b.syncedAt) - new Date(a.syncedAt))[0] || null;
}

function getAnkiImportSummaries() {
  return getAnkiImports().map((deckImport) => ({
    deck: deckImport.deck,
    syncedAt: deckImport.syncedAt,
    syncedAtDisplay: deckImport.syncedAtDisplay,
    sentenceCount: deckImport.sentences.length
  }));
}

function getCsvImportSummaries() {
  return getCsvImports().map((csvImport) => ({
    sourceName: csvImport.sourceName,
    syncedAt: csvImport.syncedAt,
    syncedAtDisplay: csvImport.syncedAtDisplay,
    sentenceCount: csvImport.sentences.length,
    skippedRowCount: csvImport.skippedRowCount || 0,
    truncatedFieldCount: csvImport.truncatedFieldCount || 0
  }));
}

function getPracticeFilters() {
  const filters = new Map();

  for (const sentence of state.sentences) {
    const id = getBunproPracticeFilterId(sentence.jlptLevel);
    const label = getBunproPracticeFilterLabel(sentence.jlptLevel);
    if (id && !filters.has(id)) filters.set(id, { id, label, source: "bunpro" });
  }

  for (const deckImport of getAnkiImports()) {
    const id = getAnkiPracticeFilterId(deckImport.deck);
    if (!filters.has(id)) {
      filters.set(id, {
        id,
        label: `Anki ${deckImport.deck}`,
        source: "anki",
        deck: deckImport.deck
      });
    }
  }

  for (const csvImport of getCsvImports()) {
    const id = getCsvPracticeFilterId(csvImport.sourceName);
    if (!filters.has(id)) {
      filters.set(id, {
        id,
        label: `CSV ${csvImport.sourceName}`,
        source: "csv",
        sourceName: csvImport.sourceName
      });
    }
  }

  return Array.from(filters.values()).sort(comparePracticeFilters);
}

function prepareSentenceForClient(sentence) {
  const source = sentence.source || "bunpro";
  if (source === "csv") {
    const sourceName = sentence.csvSourceName || sentence.sourceLabel || "CSV import";
    return {
      ...sentence,
      source,
      sourceLabel: sourceName,
      sourceContext: sentence.sourceContext || `From ${sourceName} CSV`,
      practiceFilterId: sentence.practiceFilterId || getCsvPracticeFilterId(sourceName),
      practiceFilterLabel: sentence.practiceFilterLabel || `CSV ${sourceName}`,
      grammarMeaning: sentence.grammarHint || sentence.grammarMeaning || ""
    };
  }

  if (source === "anki") {
    const deck = sentence.ankiDeck || sentence.sourceLabel || sentence.grammarTitle || "Anki";
    return {
      ...sentence,
      source,
      sourceLabel: deck,
      sourceContext: sentence.sourceContext || `From ${deck} deck`,
      practiceFilterId: sentence.practiceFilterId || getAnkiPracticeFilterId(deck),
      practiceFilterLabel: sentence.practiceFilterLabel || `Anki ${deck}`,
      grammarMeaning: sentence.grammarHint || sentence.grammarMeaning || ""
    };
  }

  return {
    ...sentence,
    source: "bunpro",
    sourceLabel: "Bunpro",
    sourceContext: sentence.sourceContext || "From Bunpro",
    practiceFilterId: sentence.practiceFilterId || getBunproPracticeFilterId(sentence.jlptLevel),
    practiceFilterLabel: sentence.practiceFilterLabel || getBunproPracticeFilterLabel(sentence.jlptLevel)
  };
}

function dedupeSentences(sentences) {
  const seen = new Set();
  const deduped = [];
  for (const sentence of sentences) {
    const key = [
      sentence.source || "",
      sentence.id || "",
      sentence.english || "",
      sentence.japanese || ""
    ].join("\u0000").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(sentence);
  }
  return deduped;
}

function normalizeJlptLevel(level) {
  const value = String(level || "").trim().toUpperCase();
  const match = value.match(/N?([1-5])$/);
  return match ? `JLPT${match[1]}` : value;
}

function getBunproPracticeFilterId(level) {
  const normalized = normalizeJlptLevel(level);
  return normalized ? `bunpro:${normalized}` : "bunpro:unknown";
}

function getBunproPracticeFilterLabel(level) {
  const label = formatJlptLabel(level);
  return label ? `Bunpro ${label}` : "Bunpro";
}

function getAnkiPracticeFilterId(deck) {
  return `anki:${String(deck || "Anki")}`;
}

function getCsvPracticeFilterId(sourceName) {
  return `csv:${String(sourceName || "CSV import")}`;
}

function formatJlptLabel(level) {
  const normalized = normalizeJlptLevel(level);
  return normalized.replace(/^JLPT([1-5])$/, "JLPT N$1");
}

function comparePracticeFilters(a, b) {
  if (a.source !== b.source) return getSourceOrder(a.source) - getSourceOrder(b.source);
  if (a.source === "bunpro") return compareJlptLevels(a.id.replace(/^bunpro:/, ""), b.id.replace(/^bunpro:/, ""));
  return a.label.localeCompare(b.label);
}

function getSourceOrder(source) {
  return { bunpro: 0, anki: 1, csv: 2 }[source] ?? 3;
}

function compareJlptLevels(a, b) {
  const order = ["JLPT5", "JLPT4", "JLPT3", "JLPT2", "JLPT1"];
  const aIndex = order.indexOf(a);
  const bIndex = order.indexOf(b);
  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
  if (aIndex !== -1) return -1;
  if (bIndex !== -1) return 1;
  return a.localeCompare(b);
}

function loadSyncCache() {
  if (!fs.existsSync(SYNC_CACHE_FILE)) return;
  try {
    const payload = JSON.parse(fs.readFileSync(SYNC_CACHE_FILE, "utf8"));
    applySyncCache(payload);
    console.log("Loaded Bunpro sync cache.");
  } catch (error) {
    console.warn(`Could not load Bunpro sync cache: ${error.message}`);
  }
}

function saveSyncCache() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const payload = {
    savedAt: new Date().toISOString(),
    syncedAt: state.syncedAt,
    syncedAtDisplay: state.syncedAtDisplay,
    overview: state.overview,
    grammarPoints: state.grammarPoints,
    sentences: state.sentences
  };
  fs.writeFileSync(SYNC_CACHE_FILE, JSON.stringify(payload, null, 2));
}

function applySyncCache(payload) {
  state.syncedAt = payload.syncedAt || payload.savedAt || null;
  state.syncedAtDisplay = payload.syncedAtDisplay || formatLocalTimestamp(state.syncedAt);
  state.overview = payload.overview || null;
  state.grammarPoints = Array.isArray(payload.grammarPoints) ? payload.grammarPoints : [];
  state.sentences = Array.isArray(payload.sentences) ? payload.sentences : [];
  state.grammarById = new Map(state.grammarPoints.map((point) => [String(point.id), point]));
  state.hydrateCache = new Map();
  for (const point of state.grammarPoints) {
    if (point.id) state.hydrateCache.set(String(point.id), point);
    if (point.slug) state.hydrateCache.set(String(point.slug), point);
  }
}

function loadAnkiCache() {
  for (const filePath of getAnkiCacheFiles()) {
    try {
      const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
      applyAnkiCache(payload);
      console.log(`Loaded Anki import cache for ${payload.deck || payload.ankiDeck || "unknown deck"}.`);
    } catch (error) {
      console.warn(`Could not load Anki import cache ${path.basename(filePath)}: ${error.message}`);
    }
  }
}

function loadCsvCache() {
  for (const filePath of getCsvCacheFiles()) {
    try {
      const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
      applyCsvCache(payload);
      console.log(`Loaded CSV import cache for ${payload.sourceName || "unknown CSV"}.`);
    } catch (error) {
      console.warn(`Could not load CSV import cache ${path.basename(filePath)}: ${error.message}`);
    }
  }
}

function saveAnkiCache(deck) {
  const deckImport = state.ankiImports.get(deck);
  if (!deckImport) return;
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const payload = {
    savedAt: new Date().toISOString(),
    deck: deckImport.deck,
    syncedAt: deckImport.syncedAt,
    syncedAtDisplay: deckImport.syncedAtDisplay,
    englishField: deckImport.englishField,
    japaneseField: deckImport.japaneseField,
    grammarHintField: deckImport.grammarHintField || "",
    sentences: deckImport.sentences
  };
  fs.writeFileSync(getAnkiCacheFile(deck), JSON.stringify(payload, null, 2));
}

function saveCsvCache(sourceName) {
  const csvImport = state.csvImports.get(sourceName);
  if (!csvImport) return;
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const payload = {
    savedAt: new Date().toISOString(),
    sourceName: csvImport.sourceName,
    syncedAt: csvImport.syncedAt,
    syncedAtDisplay: csvImport.syncedAtDisplay,
    englishColumn: csvImport.englishColumn,
    japaneseColumn: csvImport.japaneseColumn,
    hintColumn: csvImport.hintColumn,
    skippedRowCount: csvImport.skippedRowCount || 0,
    truncatedFieldCount: csvImport.truncatedFieldCount || 0,
    sentences: csvImport.sentences
  };
  fs.writeFileSync(getCsvCacheFile(sourceName), JSON.stringify(payload, null, 2));
}

function applyAnkiCache(payload) {
  const deck = payload.deck || payload.ankiDeck || null;
  if (!deck) return;
  const syncedAt = payload.syncedAt || payload.ankiSyncedAt || payload.savedAt || null;
  const current = state.ankiImports.get(deck);
  if (current?.syncedAt && syncedAt && new Date(current.syncedAt) > new Date(syncedAt)) {
    return;
  }
  state.ankiImports.set(deck, {
    deck,
    syncedAt,
    syncedAtDisplay: payload.syncedAtDisplay || payload.ankiSyncedAtDisplay || formatLocalTimestamp(syncedAt),
    englishField: payload.englishField || "",
    japaneseField: payload.japaneseField || "",
    grammarHintField: payload.grammarHintField || "",
    sentences: Array.isArray(payload.sentences)
      ? payload.sentences
      : Array.isArray(payload.ankiSentences)
        ? payload.ankiSentences
        : []
  });
}

function applyCsvCache(payload) {
  const sourceName = payload.sourceName || payload.fileName || null;
  if (!sourceName) return;
  const syncedAt = payload.syncedAt || payload.savedAt || null;
  const current = state.csvImports.get(sourceName);
  if (current?.syncedAt && syncedAt && new Date(current.syncedAt) > new Date(syncedAt)) {
    return;
  }
  state.csvImports.set(sourceName, {
    sourceName,
    syncedAt,
    syncedAtDisplay: payload.syncedAtDisplay || formatLocalTimestamp(syncedAt),
    englishColumn: Number(payload.englishColumn ?? -1),
    japaneseColumn: Number(payload.japaneseColumn ?? -1),
    hintColumn: Number(payload.hintColumn ?? -1),
    skippedRowCount: Number(payload.skippedRowCount || 0),
    truncatedFieldCount: Number(payload.truncatedFieldCount || 0),
    sentences: Array.isArray(payload.sentences) ? payload.sentences : []
  });
}

function getAnkiCacheFiles() {
  if (!fs.existsSync(CACHE_DIR)) return [];
  return fs.readdirSync(CACHE_DIR)
    .filter((fileName) => {
      const isDeckCache = fileName.startsWith(ANKI_CACHE_PREFIX) && fileName.endsWith(".json");
      const isLegacyCache = fileName === "anki-sync.json";
      return isDeckCache || isLegacyCache;
    })
    .map((fileName) => path.join(CACHE_DIR, fileName));
}

function getCsvCacheFiles() {
  if (!fs.existsSync(CACHE_DIR)) return [];
  return fs.readdirSync(CACHE_DIR)
    .filter((fileName) => fileName.startsWith(CSV_CACHE_PREFIX) && fileName.endsWith(".json"))
    .map((fileName) => path.join(CACHE_DIR, fileName));
}

function getAnkiCacheFile(deck) {
  return path.join(CACHE_DIR, `${ANKI_CACHE_PREFIX}${encodeFileToken(deck)}.json`);
}

function getCsvCacheFile(sourceName) {
  return path.join(CACHE_DIR, `${CSV_CACHE_PREFIX}${encodeFileToken(sourceName)}.json`);
}

function encodeFileToken(value) {
  return Buffer.from(String(value || "Anki"), "utf8").toString("base64url");
}

function formatLocalTimestamp(isoTimestamp) {
  if (!isoTimestamp) return null;
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short"
  });
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(body, null, 2));
}

function serveStatic(req, res, url) {
  let filePath = url.pathname === "/" ? "/index.html" : url.pathname;
  filePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = path.join(PUBLIC_DIR, filePath);
  if (!absolutePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(absolutePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      return res.end("Not found");
    }
    res.writeHead(200, {
      "Content-Type": contentType(absolutePath),
      "Cache-Control": "no-store"
    });
    res.end(data);
  });
}

function contentType(filePath) {
  const ext = path.extname(filePath);
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp"
  }[ext] || "application/octet-stream";
}

function writeEnvUpdates(updates) {
  const updateKeys = new Set(Object.keys(updates));
  const seenKeys = new Set();
  const lines = fs.existsSync(ENV_FILE)
    ? fs.readFileSync(ENV_FILE, "utf8").split(/\r?\n/)
    : [];

  const nextLines = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return line;
    const eq = line.indexOf("=");
    if (eq === -1) return line;
    const key = line.slice(0, eq).trim();
    if (!updateKeys.has(key)) return line;
    seenKeys.add(key);
    return `${key}=${formatEnvValue(updates[key])}`;
  });

  for (const key of updateKeys) {
    if (!seenKeys.has(key)) {
      nextLines.push(`${key}=${formatEnvValue(updates[key])}`);
    }
  }

  fs.writeFileSync(ENV_FILE, `${nextLines.join("\n").replace(/\n+$/, "")}\n`);
}

function formatEnvValue(value) {
  const text = String(value || "");
  return /^[^\s#"']+$/.test(text) ? text : JSON.stringify(text);
}

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = parseEnvValue(trimmed.slice(eq + 1).trim());
    if (!process.env[key]) process.env[key] = value;
  }
}

function parseEnvValue(value) {
  if (!value) return "";
  if (value.startsWith("\"") || value.startsWith("'")) {
    try {
      return JSON.parse(value);
    } catch {
      return value.replace(/^["']|["']$/g, "");
    }
  }
  return value;
}
