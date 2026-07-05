const statusText = document.querySelector("#statusText");
const appVersion = document.querySelector("#appVersion");
const syncButton = document.querySelector("#syncButton");
const previousButton = document.querySelector("#previousButton");
const skipMissedButton = document.querySelector("#skipMissedButton");
const nextButton = document.querySelector("#nextButton");
const gradeButton = document.querySelector("#gradeButton");
const answerForm = document.querySelector("#answerForm");
const answerInput = document.querySelector("#answerInput");
const hintToggle = document.querySelector("#hintToggle");
const grammarHint = document.querySelector("#grammarHint");
const grammarHintMeta = document.querySelector("#grammarHintMeta");
const jlptLevel = document.querySelector("#jlptLevel");
const grammarTitle = document.querySelector("#grammarTitle");
const grammarMeaning = document.querySelector("#grammarMeaning");
const sourceContext = document.querySelector("#sourceContext");
const englishPrompt = document.querySelector("#englishPrompt");
const gettingStartedPanel = document.querySelector("#gettingStartedPanel");
const startSetupButton = document.querySelector("#startSetupButton");
const referenceJapanese = document.querySelector("#referenceJapanese");
const resultPanel = document.querySelector("#resultPanel");
const verdictPill = document.querySelector("#verdictPill");
const scoreText = document.querySelector("#scoreText");
const feedbackText = document.querySelector("#feedbackText");
const referenceSentenceText = document.querySelector("#referenceSentenceText");
const correctionText = document.querySelector("#correctionText");
const drillForm = document.querySelector("#drillForm");
const drillInput = document.querySelector("#drillInput");
const drillButton = document.querySelector("#drillButton");
const drillFeedback = document.querySelector("#drillFeedback");
const retryDelayInput = document.querySelector("#retryDelayInput");
const retryStatus = document.querySelector("#retryStatus");
const answeredSessionCount = document.querySelector("#answeredSessionCount");
const jlptFilter = document.querySelector("#jlptFilter");
const jlptFilterOptions = document.querySelector("#jlptFilterOptions");
const importStatusPanel = document.querySelector("#importStatusPanel");
const openSettingsButton = document.querySelector("#openSettingsButton");
const settingsModal = document.querySelector("#settingsModal");
const closeSettingsButton = document.querySelector("#closeSettingsButton");
const startTabButton = document.querySelector("#startTabButton");
const settingsTabButtons = Array.from(document.querySelectorAll("[data-settings-tab]"));
const settingsTabPanels = Array.from(document.querySelectorAll("[data-settings-panel]"));
const setupLlmButton = document.querySelector("#setupLlmButton");
const setupAnkiButton = document.querySelector("#setupAnkiButton");
const setupBunproButton = document.querySelector("#setupBunproButton");
const setupCsvButton = document.querySelector("#setupCsvButton");
const startDemoSentencesToggle = document.querySelector("#startDemoSentencesToggle");
const demoSentencesToggle = document.querySelector("#demoSentencesToggle");
const demoSentencesStatus = document.querySelector("#demoSentencesStatus");
const bunproSettingsForm = document.querySelector("#bunproSettingsForm");
const bunproTokenInput = document.querySelector("#bunproTokenInput");
const saveBunproTokenButton = document.querySelector("#saveBunproTokenButton");
const bunproSettingsStatus = document.querySelector("#bunproSettingsStatus");
const llmSettingsForm = document.querySelector("#llmSettingsForm");
const llmBaseUrlInput = document.querySelector("#llmBaseUrlInput");
const llmApiKeyInput = document.querySelector("#llmApiKeyInput");
const llmModelInput = document.querySelector("#llmModelInput");
const saveLlmSettingsButton = document.querySelector("#saveLlmSettingsButton");
const llmSettingsStatus = document.querySelector("#llmSettingsStatus");
const feedbackSettingsForm = document.querySelector("#feedbackSettingsForm");
const feedbackLanguageInputs = Array.from(document.querySelectorAll("input[name='feedbackLanguage']"));
const customFeedbackLanguageField = document.querySelector("#customFeedbackLanguageField");
const customFeedbackLanguageInput = document.querySelector("#customFeedbackLanguageInput");
const customFeedbackLanguageCounter = document.querySelector("#customFeedbackLanguageCounter");
const customInstructionsInput = document.querySelector("#customInstructionsInput");
const customInstructionsCounter = document.querySelector("#customInstructionsCounter");
const saveFeedbackSettingsButton = document.querySelector("#saveFeedbackSettingsButton");
const feedbackSettingsStatus = document.querySelector("#feedbackSettingsStatus");
const ankiConnectButton = document.querySelector("#ankiConnectButton");
const ankiDeckSelect = document.querySelector("#ankiDeckSelect");
const ankiEnglishFieldSelect = document.querySelector("#ankiEnglishFieldSelect");
const ankiJapaneseFieldSelect = document.querySelector("#ankiJapaneseFieldSelect");
const ankiGrammarHintFieldSelect = document.querySelector("#ankiGrammarHintFieldSelect");
const ankiPreviewButton = document.querySelector("#ankiPreviewButton");
const ankiImportButton = document.querySelector("#ankiImportButton");
const ankiStatus = document.querySelector("#ankiStatus");
const ankiPreview = document.querySelector("#ankiPreview");
const ankiFields = Array.from(document.querySelectorAll(".anki-field"));
const csvFileInput = document.querySelector("#csvFileInput");
const csvSourceNameInput = document.querySelector("#csvSourceNameInput");
const csvColumnFields = document.querySelector("#csvColumnFields");
const csvEnglishColumnSelect = document.querySelector("#csvEnglishColumnSelect");
const csvJapaneseColumnSelect = document.querySelector("#csvJapaneseColumnSelect");
const csvHintColumnSelect = document.querySelector("#csvHintColumnSelect");
const csvPreviewButton = document.querySelector("#csvPreviewButton");
const csvImportButton = document.querySelector("#csvImportButton");
const csvStatus = document.querySelector("#csvStatus");
const csvPreview = document.querySelector("#csvPreview");
const gettingStartedSeenKey = "jfst-getting-started-seen";
const demoSentencesEnabledKey = "jfst-demo-sentences-enabled";
const demoSentences = [
  {
    id: "demo:n5:1",
    source: "demo",
    sourceLabel: "Demo",
    sourceContext: "From demo sentences",
    grammarHint: "Use が to mark the subject.",
    practiceFilterId: "demo:n5",
    practiceFilterLabel: "Demo N5",
    english: "The sea is beautiful.",
    japanese: "海がきれいです。"
  },
  {
    id: "demo:n5:2",
    source: "demo",
    sourceLabel: "Demo",
    sourceContext: "From demo sentences",
    grammarHint: "Use を to mark the direct object.",
    practiceFilterId: "demo:n5",
    practiceFilterLabel: "Demo N5",
    english: "I drink water.",
    japanese: "水を飲みます。"
  },
  {
    id: "demo:n5:3",
    source: "demo",
    sourceLabel: "Demo",
    sourceContext: "From demo sentences",
    grammarHint: "Use に for the destination.",
    practiceFilterId: "demo:n5",
    practiceFilterLabel: "Demo N5",
    english: "I went to school yesterday.",
    japanese: "昨日学校に行きました。"
  },
  {
    id: "demo:n5:4",
    source: "demo",
    sourceLabel: "Demo",
    sourceContext: "From demo sentences",
    grammarHint: "これは points to something near the speaker.",
    practiceFilterId: "demo:n5",
    practiceFilterLabel: "Demo N5",
    english: "This is a book.",
    japanese: "これは本です。"
  },
  {
    id: "demo:n5:5",
    source: "demo",
    sourceLabel: "Demo",
    sourceContext: "From demo sentences",
    grammarHint: "Use います for living things.",
    practiceFilterId: "demo:n5",
    practiceFilterLabel: "Demo N5",
    english: "There is a cat under the table.",
    japanese: "テーブルの下に猫がいます。"
  },
  {
    id: "demo:n5:6",
    source: "demo",
    sourceLabel: "Demo",
    sourceContext: "From demo sentences",
    grammarHint: "Use で for the place where an action happens.",
    practiceFilterId: "demo:n5",
    practiceFilterLabel: "Demo N5",
    english: "I study Japanese at home.",
    japanese: "家で日本語を勉強します。"
  },
  {
    id: "demo:n5:7",
    source: "demo",
    sourceLabel: "Demo",
    sourceContext: "From demo sentences",
    grammarHint: "Use と to connect nouns.",
    practiceFilterId: "demo:n5",
    practiceFilterLabel: "Demo N5",
    english: "I ate bread and eggs.",
    japanese: "パンと卵を食べました。"
  },
  {
    id: "demo:n5:8",
    source: "demo",
    sourceLabel: "Demo",
    sourceContext: "From demo sentences",
    grammarHint: "Use じゃありません for the negative of です.",
    practiceFilterId: "demo:n5",
    practiceFilterLabel: "Demo N5",
    english: "That person is not a student.",
    japanese: "あの人は学生じゃありません。"
  },
  {
    id: "demo:n5:9",
    source: "demo",
    sourceLabel: "Demo",
    sourceContext: "From demo sentences",
    grammarHint: "Use ませんでした for polite past negative verbs.",
    practiceFilterId: "demo:n5",
    practiceFilterLabel: "Demo N5",
    english: "I did not watch TV yesterday.",
    japanese: "昨日テレビを見ませんでした。"
  },
  {
    id: "demo:n5:10",
    source: "demo",
    sourceLabel: "Demo",
    sourceContext: "From demo sentences",
    grammarHint: "Use から for a starting time.",
    practiceFilterId: "demo:n5",
    practiceFilterLabel: "Demo N5",
    english: "The class starts at nine o'clock.",
    japanese: "授業は九時から始まります。"
  }
];

let currentSentence = null;
let currentCorrectAnswers = [];
let lastStatusText = "";
let sessionHistory = [];
let sessionIndex = -1;
let nextSessionEntryId = 1;
let answeredThisSessionCount = 0;
let retryQueue = [];
let recentQuestionIds = [];
let sentencePool = [];
let availablePracticeFilters = [];
let selectedPracticeFilters = new Set();
let busy = false;
let ankiBusy = false;
let csvBusy = false;
let csvText = "";

syncButton.addEventListener("click", syncBunpro);
previousButton.addEventListener("click", showPreviousSentence);
skipMissedButton.addEventListener("click", skipToMissed);
nextButton.addEventListener("click", showNextSentence);
answerForm.addEventListener("submit", gradeAnswer);
drillForm.addEventListener("submit", checkDrillAnswer);
hintToggle.addEventListener("change", updateHintPreference);
answerInput.addEventListener("input", saveCurrentDraft);
answerInput.addEventListener("keydown", focusDrillFromAnswerOnTab);
drillInput.addEventListener("input", saveCurrentDraft);
retryDelayInput.addEventListener("change", updateRetryDelayPreference);
jlptFilterOptions.addEventListener("change", updateJlptFilterPreference);
openSettingsButton.addEventListener("click", () => openSettingsModal("start"));
startSetupButton.addEventListener("click", () => openSettingsModal("start"));
closeSettingsButton.addEventListener("click", closeSettingsModal);
settingsModal.addEventListener("click", closeSettingsModalFromBackdrop);
document.addEventListener("keydown", closeSettingsModalFromKeyboard);
settingsTabButtons.forEach((button) => {
  button.addEventListener("click", () => showSettingsTab(button.dataset.settingsTab));
});
setupLlmButton.addEventListener("click", () => showSettingsTab("llm"));
setupAnkiButton.addEventListener("click", () => showSettingsTab("anki"));
setupBunproButton.addEventListener("click", () => showSettingsTab("bunpro"));
setupCsvButton.addEventListener("click", () => showSettingsTab("csv"));
startDemoSentencesToggle.addEventListener("change", updateDemoSentencesPreference);
demoSentencesToggle.addEventListener("change", updateDemoSentencesPreference);
bunproSettingsForm.addEventListener("submit", saveBunproSettings);
llmSettingsForm.addEventListener("submit", saveLlmSettings);
feedbackSettingsForm.addEventListener("submit", saveFeedbackSettings);
for (const input of feedbackLanguageInputs) {
  input.addEventListener("change", updateCustomFeedbackLanguageVisibility);
}
customFeedbackLanguageInput.addEventListener("input", updateCustomFeedbackLanguageCounter);
customInstructionsInput.addEventListener("input", updateCustomInstructionsCounter);
ankiConnectButton.addEventListener("click", loadAnkiDecks);
ankiDeckSelect.addEventListener("change", loadAnkiFields);
ankiPreviewButton.addEventListener("click", previewAnkiImport);
ankiImportButton.addEventListener("click", importAnkiSentences);
csvFileInput.addEventListener("change", loadCsvFile);
csvPreviewButton.addEventListener("click", previewCsvImport);
csvImportButton.addEventListener("click", importCsvSentences);
setInterval(updateRetryStatus, 15000);

boot();

async function boot() {
  try {
    initializeHintPreference();
    initializeRetryDelayPreference();
    initializeDemoSentencesPreference();
    const status = await api("/api/status");
    renderStatus(status);
    updateSettingsPlaceholders(status);
    if (getAvailableSentenceCount(status) > 0) {
      await loadSentencePool();
      await showNextSentence();
    } else {
      renderJlptFilter([]);
    }
  } catch (error) {
    statusText.textContent = error.message;
  }
}

function openSettingsModal(tab = "start") {
  showSettingsTab(getAvailableSettingsTab(tab));
  settingsModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
  markGettingStartedSeen();
  closeSettingsButton.focus();
}

function closeSettingsModal() {
  settingsModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  openSettingsButton.focus();
}

function closeSettingsModalFromBackdrop(event) {
  if (event.target === settingsModal) closeSettingsModal();
}

function closeSettingsModalFromKeyboard(event) {
  if (event.key === "Escape" && !settingsModal.classList.contains("hidden")) {
    closeSettingsModal();
  }
}

function showSettingsTab(tab) {
  const nextTab = getAvailableSettingsTab(tab);
  for (const button of settingsTabButtons) {
    const isActive = button.dataset.settingsTab === nextTab;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  }

  for (const panel of settingsTabPanels) {
    const isActive = panel.dataset.settingsPanel === nextTab;
    panel.classList.toggle("hidden", !isActive);
  }
}

function renderGettingStarted(status) {
  const hasImportedSentences = Number(status.sentenceCount || 0) > 0;
  const hasDemoSentences = isDemoSentencesEnabled();
  const needsSetup = status.hasLlmCredentials === false || !hasImportedSentences;
  const setupComplete = !needsSetup;
  gettingStartedPanel.classList.toggle("hidden", !needsSetup || hasDemoSentences);
  startTabButton.classList.toggle("hidden", setupComplete);
  if (setupComplete && startTabButton.classList.contains("active")) {
    showSettingsTab("anki");
  }

  if (needsSetup && !hasSeenGettingStarted()) {
    window.requestAnimationFrame(() => openSettingsModal("start"));
  }
}

function getAvailableSettingsTab(tab) {
  if (tab !== "start" || !startTabButton.classList.contains("hidden")) return tab;
  return "anki";
}

function hasSeenGettingStarted() {
  try {
    return window.localStorage.getItem(gettingStartedSeenKey) === "true";
  } catch {
    return false;
  }
}

function markGettingStartedSeen() {
  try {
    window.localStorage.setItem(gettingStartedSeenKey, "true");
  } catch {
    // Local storage can be unavailable in stricter browser settings.
  }
}

async function syncBunpro() {
  setBusy(true, "Importing Bunpro grammar points and sentences... This may take a while.");
  bunproSettingsStatus.textContent = "Importing Bunpro grammar points and sentences... This may take a while.";
  try {
    await api("/api/sync", { method: "POST" });
    const status = await api("/api/status");
    renderStatus(status);
    updateSettingsPlaceholders(status);
    await loadSentencePool({ resetLevels: true });
    resetSessionHistory();
    await showNextSentence();
    bunproSettingsStatus.textContent = `Imported ${status.bunproSentenceCount || 0} Bunpro sentences.`;
  } catch (error) {
    statusText.textContent = error.message;
    bunproSettingsStatus.textContent = error.message;
  } finally {
    setBusy(false);
  }
}

async function showNextSentence() {
  saveCurrentDraft();
  if (sessionIndex < sessionHistory.length - 1) {
    sessionIndex += 1;
    renderSessionEntry(sessionHistory[sessionIndex]);
    restoreStatusText();
    updateNavigationState();
    return;
  }

  const retry = takeDueRetry();
  if (retry) {
    sessionHistory.push(createSessionEntry(retry.sentence, { source: "retry", retryOf: retry.sourceEntryId }));
    sessionIndex = sessionHistory.length - 1;
    rememberAskedSentence(retry.sentence);
    renderSessionEntry(sessionHistory[sessionIndex], { focus: true });
    restoreStatusText();
    updateRetryStatus();
    updateNavigationState();
    return;
  }

  if (sentencePool.length === 0) {
    setBusy(true, "Loading sentences...");
    try {
      await loadSentencePool();
    } catch (error) {
      statusText.textContent = error.message;
      return;
    } finally {
      setBusy(false);
    }
  }

  const filteredSentences = getFilteredSentences();
  if (selectedPracticeFilters.size === 0) {
    statusText.textContent = "Select at least one practice filter.";
    return;
  }
  if (filteredSentences.length === 0) {
    statusText.textContent = "No sentences match the selected practice filters.";
    return;
  }

  const sentence = chooseRandomQuestion(filteredSentences);
  sessionHistory.push(createSessionEntry(sentence, { source: "random" }));
  sessionIndex = sessionHistory.length - 1;
  rememberAskedSentence(sentence);
  renderSessionEntry(sessionHistory[sessionIndex], { focus: true });
  restoreStatusText();
  updateNavigationState();
}

function showPreviousSentence() {
  if (sessionIndex <= 0) return;
  saveCurrentDraft();
  sessionIndex -= 1;
  renderSessionEntry(sessionHistory[sessionIndex]);
  restoreStatusText();
  updateNavigationState();
}

function skipToMissed() {
  saveCurrentDraft();
  const retry = takeNextRetry();
  if (!retry) {
    updateRetryStatus();
    return;
  }
  sessionHistory.push(createSessionEntry(retry.sentence, { source: "retry", retryOf: retry.sourceEntryId }));
  sessionIndex = sessionHistory.length - 1;
  rememberAskedSentence(retry.sentence);
  renderSessionEntry(sessionHistory[sessionIndex], { focus: true });
  restoreStatusText();
  updateRetryStatus();
  updateNavigationState();
}

async function gradeAnswer(event) {
  event.preventDefault();
  if (isCurrentAnswerCorrect()) {
    await showNextSentence();
    return;
  }

  if (!currentSentence) {
    statusText.textContent = "Load a sentence first.";
    return;
  }
  const answer = answerInput.value.trim();
  if (!answer) {
    statusText.textContent = "Type your Japanese answer first.";
    answerInput.focus();
    return;
  }

  gradeButton.disabled = true;
  statusText.textContent = "Grading...";
  try {
    const result = await api("/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sentence: currentSentence, answer })
    });
    renderGrade(result);
    const entry = getCurrentEntry();
    if (entry) {
      markEntryAnswered(entry);
      entry.answer = answer;
      entry.grade = result;
      scheduleRetryForEntry(entry, result);
    }
    restoreStatusText();
  } catch (error) {
    statusText.textContent = error.message;
  } finally {
    gradeButton.disabled = false;
  }
}

function renderStatus(status) {
  if (status.appVersion) {
    appVersion.textContent = `v${status.appVersion}`;
  }

  const llmStatus = status.hasLlmCredentials === false ? "LLM key missing" : `Grading with ${status.model || "configured model"}`;
  const sourceParts = [];
  const totalSentences = getAvailableSentenceCount(status);
  if (status.ankiSentenceCount) {
    sourceParts.push(`Anki ${status.ankiSentenceCount}`);
  }

  if (status.csvSentenceCount) {
    sourceParts.push(`CSV ${status.csvSentenceCount}`);
  }

  if (status.bunproSentenceCount) {
    sourceParts.push(`Bunpro ${status.bunproSentenceCount}`);
  }

  if (isDemoSentencesEnabled()) {
    sourceParts.push(`Demo ${demoSentences.length}`);
  }

  const importStatus = totalSentences
    ? `${totalSentences} sentences${sourceParts.length ? ` (${sourceParts.join(", ")})` : ""}`
    : "No imported sentences yet";
  lastStatusText = `${llmStatus}. ${importStatus}.`;
  renderImportStatusPanel(status);
  renderGettingStarted(status);
  restoreStatusText();
}

function renderImportStatusPanel(status) {
  importStatusPanel.textContent = "";
  const rows = [];

  if (status.ankiSentenceCount) {
    rows.push({
      source: "Anki",
      details: `${status.ankiSentenceCount} sentences`,
      importedAt: status.ankiSyncedAt ? `Last import ${formatSyncTime(status.ankiSyncedAt)}` : ""
    });
  }

  if (status.bunproSentenceCount) {
    rows.push({
      source: "Bunpro",
      details: `${status.bunproSentenceCount} sentences, ${status.grammarPointCount || 0} grammar points`,
      importedAt: status.syncedAt ? `Last import ${formatSyncTime(status.syncedAt)}` : ""
    });
  }

  if (status.csvSentenceCount) {
    const csvFiles = Array.isArray(status.csvFiles) ? status.csvFiles : [];
    const lastCsv = csvFiles
      .filter((item) => item.syncedAt)
      .sort((a, b) => new Date(b.syncedAt) - new Date(a.syncedAt))[0];
    rows.push({
      source: "CSV",
      details: `${status.csvSentenceCount} sentences${csvFiles.length > 1 ? `, ${csvFiles.length} files` : ""}`,
      importedAt: lastCsv?.syncedAt ? `Last import ${formatSyncTime(lastCsv.syncedAt)}` : ""
    });
  }

  if (isDemoSentencesEnabled()) {
    rows.push({
      source: "Demo",
      details: `${demoSentences.length} built-in sentences`,
      importedAt: ""
    });
  }

  importStatusPanel.classList.toggle("hidden", rows.length === 0);

  for (const row of rows) {
    const item = document.createElement("div");
    item.className = "import-status-row";

    const source = document.createElement("span");
    source.className = "import-status-source";
    source.textContent = row.source;

    const detail = document.createElement("span");
    detail.textContent = row.importedAt
      ? `${row.details}. ${row.importedAt}.`
      : row.details;

    item.append(source, detail);
    importStatusPanel.append(item);
  }
}

function getAvailableSentenceCount(status) {
  return Number(status.sentenceCount || 0) + (isDemoSentencesEnabled() ? demoSentences.length : 0);
}

function updateSettingsPlaceholders(status) {
  bunproTokenInput.placeholder = status.hasBunproToken ? "Token saved" : "Paste token to save";
  llmBaseUrlInput.placeholder = status.llmBaseUrl || "https://generativelanguage.googleapis.com/v1beta/openai";
  llmApiKeyInput.placeholder = status.hasLlmCredentials ? "Key saved" : "Paste key to save";
  llmModelInput.placeholder = status.model || "gemini-3.5-flash";
  const feedbackLanguage = String(status.feedbackLanguage || "english").trim();
  const normalizedFeedbackLanguage = feedbackLanguage.toLowerCase();
  for (const input of feedbackLanguageInputs) {
    input.checked = input.value === normalizedFeedbackLanguage;
  }
  const isCustomFeedbackLanguage = !["english", "japanese"].includes(normalizedFeedbackLanguage);
  if (isCustomFeedbackLanguage) {
    const otherInput = feedbackLanguageInputs.find((input) => input.value === "other");
    if (otherInput) otherInput.checked = true;
    customFeedbackLanguageInput.value = feedbackLanguage;
  } else {
    customFeedbackLanguageInput.value = "";
  }
  customInstructionsInput.value = status.customInstructions || "";
  updateCustomFeedbackLanguageVisibility();
  updateCustomFeedbackLanguageCounter();
  updateCustomInstructionsCounter();
}

async function saveBunproSettings(event) {
  event.preventDefault();
  const bunproToken = bunproTokenInput.value.trim();
  if (!bunproToken) {
    bunproSettingsStatus.textContent = "Paste a Bunpro token first.";
    return;
  }

  setSettingsBusy(true, "Saving Bunpro token...");
  try {
    await api("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bunproToken })
    });
    bunproSettingsForm.reset();
    const status = await api("/api/status");
    renderStatus(status);
    updateSettingsPlaceholders(status);
    bunproSettingsStatus.textContent = "Bunpro token saved to .env.";
  } catch (error) {
    bunproSettingsStatus.textContent = error.message;
  } finally {
    setSettingsBusy(false);
  }
}

async function saveLlmSettings(event) {
  event.preventDefault();
  const payload = {
    llmBaseUrl: llmBaseUrlInput.value.trim(),
    llmApiKey: llmApiKeyInput.value.trim(),
    llmModel: llmModelInput.value.trim()
  };
  if (!payload.llmBaseUrl && !payload.llmApiKey && !payload.llmModel) {
    llmSettingsStatus.textContent = "Enter at least one LLM setting first.";
    return;
  }

  setSettingsBusy(true, "Saving LLM settings...");
  try {
    await api("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    llmSettingsForm.reset();
    const status = await api("/api/status");
    renderStatus(status);
    updateSettingsPlaceholders(status);
    llmSettingsStatus.textContent = "LLM settings saved to .env.";
  } catch (error) {
    llmSettingsStatus.textContent = error.message;
  } finally {
    setSettingsBusy(false);
  }
}

async function saveFeedbackSettings(event) {
  event.preventDefault();
  const feedbackLanguage = getSelectedFeedbackLanguage();
  if (!feedbackLanguage) {
    feedbackSettingsStatus.textContent = "Enter a response language first.";
    return;
  }
  const customInstructions = customInstructionsInput.value.trim();

  setSettingsBusy(true, "Saving model personalisation...");
  try {
    await api("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedbackLanguage, customInstructions })
    });
    const status = await api("/api/status");
    renderStatus(status);
    updateSettingsPlaceholders(status);
    feedbackSettingsStatus.textContent = "Model personalisation saved to .env.";
  } catch (error) {
    feedbackSettingsStatus.textContent = error.message;
  } finally {
    setSettingsBusy(false);
  }
}

function getSelectedFeedbackLanguage() {
  const selected = feedbackLanguageInputs.find((input) => input.checked)?.value || "english";
  if (selected !== "other") return selected;
  return customFeedbackLanguageInput.value.trim();
}

function updateCustomFeedbackLanguageVisibility() {
  const isOther = (feedbackLanguageInputs.find((input) => input.checked)?.value || "english") === "other";
  customFeedbackLanguageField.classList.toggle("hidden", !isOther);
  customFeedbackLanguageCounter.classList.toggle("hidden", !isOther);
}

function updateCustomFeedbackLanguageCounter() {
  customFeedbackLanguageCounter.textContent = `${customFeedbackLanguageInput.value.length} / ${customFeedbackLanguageInput.maxLength} characters`;
}

function updateCustomInstructionsCounter() {
  customInstructionsCounter.textContent = `${customInstructionsInput.value.length} / ${customInstructionsInput.maxLength} characters`;
}

async function loadAnkiDecks() {
  setAnkiBusy(true, "Connecting to Anki...");
  try {
    const payload = await api("/api/anki/decks");
    populateSelect(ankiDeckSelect, payload.decks || []);
    const hasDecks = ankiDeckSelect.options.length > 0;
    ankiFields[0].classList.toggle("hidden", !hasDecks);
    ankiStatus.textContent = hasDecks ? "Choose a deck, then choose the fields to import." : "No Anki decks found.";
    if (hasDecks) {
      await loadAnkiFields();
    }
  } catch (error) {
    ankiStatus.textContent = error.message;
  } finally {
    setAnkiBusy(false);
  }
}

async function loadAnkiFields() {
  const deck = ankiDeckSelect.value;
  if (!deck) return;
  setAnkiBusy(true, "Loading fields...");
  try {
    const payload = await api("/api/anki/fields", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deck })
    });
    const fields = payload.fields || [];
    populateSelect(ankiEnglishFieldSelect, fields);
    populateSelect(ankiJapaneseFieldSelect, fields);
    populateSelect(ankiGrammarHintFieldSelect, fields, { blankLabel: "No grammar hint" });
    selectLikelyField(ankiEnglishFieldSelect, ["english", "translation", "meaning", "front"]);
    selectLikelyField(ankiJapaneseFieldSelect, ["japanese", "sentence", "expression", "back"]);
    selectLikelyField(ankiGrammarHintFieldSelect, ["grammar", "hint", "note", "explanation"]);

    const hasFields = fields.length > 0;
    ankiFields.slice(1).forEach((field) => field.classList.toggle("hidden", !hasFields));
    ankiPreviewButton.classList.toggle("hidden", !hasFields);
    ankiImportButton.classList.toggle("hidden", !hasFields);
    ankiPreview.classList.add("hidden");
    ankiPreview.textContent = "";
    ankiStatus.textContent = hasFields
      ? `${payload.noteCount || 0} notes found in ${deck}.`
      : `No fields found in ${deck}.`;
  } catch (error) {
    ankiStatus.textContent = error.message;
  } finally {
    setAnkiBusy(false);
  }
}

async function previewAnkiImport() {
  const options = getAnkiImportOptions();
  if (!options) return;
  setAnkiBusy(true, "Previewing import...");
  try {
    const payload = await api("/api/anki/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options)
    });
    renderAnkiPreview(payload);
    const usableCount = payload.usableSentenceCount || 0;
    ankiStatus.textContent = `${payload.noteCount || 0} notes found. ${usableCount} usable sentence ${usableCount === 1 ? "pair" : "pairs"} from the first ${payload.checkedNoteCount || 0} checked notes.`;
  } catch (error) {
    ankiStatus.textContent = error.message;
  } finally {
    setAnkiBusy(false);
  }
}

async function importAnkiSentences() {
  const options = getAnkiImportOptions();
  if (!options) return;
  setAnkiBusy(true, "Importing Anki sentences... This may take a while.");
  try {
    const result = await api("/api/anki/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options)
    });
    const status = await api("/api/status");
    renderStatus(status);
    await loadSentencePool({ resetLevels: true });
    resetSessionHistory();
    await showNextSentence();
    ankiStatus.textContent = `Imported ${result.importedSentenceCount || 0} sentence pairs from ${result.deck}.`;
  } catch (error) {
    ankiStatus.textContent = error.message;
  } finally {
    setAnkiBusy(false);
  }
}

function getAnkiImportOptions() {
  const deck = ankiDeckSelect.value;
  const englishField = ankiEnglishFieldSelect.value;
  const japaneseField = ankiJapaneseFieldSelect.value;
  const grammarHintField = ankiGrammarHintFieldSelect.value;
  if (!deck || !englishField || !japaneseField) {
    ankiStatus.textContent = "Choose a deck, English field, and Japanese field first.";
    return null;
  }
  return { deck, englishField, japaneseField, grammarHintField };
}

function renderAnkiPreview(payload) {
  const sentences = Array.isArray(payload) ? payload : payload.preview || [];
  ankiPreview.textContent = "";
  ankiPreview.classList.remove("hidden");
  for (const sentence of sentences) {
    const row = document.createElement("div");
    row.className = "anki-preview-row";

    const english = document.createElement("p");
    english.textContent = sentence.english;

    const japanese = document.createElement("p");
    japanese.textContent = sentence.japanese;

    row.append(english, japanese);
    ankiPreview.append(row);
  }
  if (sentences.length === 0) {
    const diagnostics = document.createElement("div");
    diagnostics.className = "anki-preview-row";

    const heading = document.createElement("p");
    heading.textContent = "No usable sentence pairs found with the selected fields.";

    const fieldInfo = document.createElement("p");
    const selectedFields = payload.selectedFields || {};
    fieldInfo.textContent = `Selected English: ${selectedFields.englishField || "-"} / Japanese: ${selectedFields.japaneseField || "-"}`;

    diagnostics.append(heading, fieldInfo);

    for (const sample of payload.samples || []) {
      const sampleText = document.createElement("p");
      sampleText.textContent = `Sample ${sample.noteId}: EN "${sample.english || "(empty)"}" / JA "${sample.japanese || "(empty)"}"`;
      diagnostics.append(sampleText);
    }

    ankiPreview.append(diagnostics);
  }
}

async function loadCsvFile() {
  const file = csvFileInput.files?.[0];
  csvText = "";
  csvPreview.classList.add("hidden");
  csvPreview.textContent = "";
  csvColumnFields.classList.add("hidden");
  csvSourceNameInput.classList.add("hidden");
  setCsvControlsDisabled(busy || csvBusy);

  if (!file) {
    csvStatus.textContent = "";
    return;
  }

  setCsvBusy(true, "Reading CSV file...");
  try {
    csvText = await file.text();
    csvSourceNameInput.value = file.name.replace(/\.csv$/i, "");
    csvSourceNameInput.classList.remove("hidden");
    await previewCsvImport();
  } catch (error) {
    csvStatus.textContent = error.message;
  } finally {
    setCsvBusy(false);
  }
}

async function previewCsvImport() {
  if (!csvText) {
    csvStatus.textContent = "Choose a CSV file first.";
    return;
  }

  setCsvBusy(true, "Previewing CSV...");
  try {
    const payload = await api("/api/csv/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: csvFileInput.files?.[0]?.name || csvSourceNameInput.value,
        sourceName: csvSourceNameInput.value,
        csvText,
        englishColumn: csvColumnFields.classList.contains("hidden") ? "" : csvEnglishColumnSelect.selectedIndex,
        japaneseColumn: csvColumnFields.classList.contains("hidden") ? "" : csvJapaneseColumnSelect.selectedIndex,
        hintColumn: csvColumnFields.classList.contains("hidden") ? "" : csvHintColumnSelect.selectedIndex - 1
      })
    });
    renderCsvColumns(payload);
    renderCsvPreview(payload);
    csvStatus.textContent = `${payload.rowCount || 0} rows found. ${payload.usableSentenceCount || 0} usable sentence pairs.`;
  } catch (error) {
    csvStatus.textContent = error.message;
  } finally {
    setCsvBusy(false);
  }
}

async function importCsvSentences() {
  const options = getCsvImportOptions();
  if (!options) return;
  setCsvBusy(true, "Importing CSV sentences...");
  try {
    const result = await api("/api/csv/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options)
    });
    const status = await api("/api/status");
    renderStatus(status);
    await loadSentencePool({ resetLevels: true });
    resetSessionHistory();
    await showNextSentence();
    const skipped = result.skippedRowCount ? ` ${result.skippedRowCount} rows skipped.` : "";
    const truncated = result.truncatedFieldCount ? ` ${result.truncatedFieldCount} long fields shortened.` : "";
    csvStatus.textContent = `Imported ${result.importedSentenceCount || 0} sentence pairs from ${result.sourceName}.${skipped}${truncated}`;
  } catch (error) {
    csvStatus.textContent = error.message;
  } finally {
    setCsvBusy(false);
  }
}

function renderCsvColumns(payload) {
  const columns = payload.columns || [];
  populateSelect(csvEnglishColumnSelect, columns.map((column) => column.label));
  populateSelect(csvJapaneseColumnSelect, columns.map((column) => column.label));
  populateSelect(csvHintColumnSelect, columns.map((column) => column.label), { blankLabel: "No hint" });

  const selected = payload.selectedColumns || {};
  if (selected.englishColumn >= 0) csvEnglishColumnSelect.selectedIndex = selected.englishColumn;
  if (selected.japaneseColumn >= 0) csvJapaneseColumnSelect.selectedIndex = selected.japaneseColumn;
  if (selected.hintColumn >= 0) csvHintColumnSelect.selectedIndex = selected.hintColumn + 1;

  csvColumnFields.classList.toggle("hidden", columns.length === 0);
  setCsvControlsDisabled(busy || csvBusy);
}

function renderCsvPreview(payload) {
  csvPreview.textContent = "";
  csvPreview.classList.remove("hidden");
  const sentences = payload.preview || [];
  for (const sentence of sentences) {
    const row = document.createElement("div");
    row.className = "anki-preview-row";

    const english = document.createElement("p");
    english.textContent = sentence.english;

    const japanese = document.createElement("p");
    japanese.textContent = sentence.japanese;

    row.append(english, japanese);
    if (sentence.grammarHint) {
      const hint = document.createElement("p");
      hint.textContent = `Hint: ${sentence.grammarHint}`;
      row.append(hint);
    }
    csvPreview.append(row);
  }

  if (sentences.length === 0) {
    const empty = document.createElement("div");
    empty.className = "anki-preview-row";
    const message = document.createElement("p");
    message.textContent = "No usable sentence pairs found with the selected columns.";
    empty.append(message);
    csvPreview.append(empty);
  }
}

function getCsvImportOptions() {
  if (!csvText) {
    csvStatus.textContent = "Choose a CSV file first.";
    return null;
  }
  const sourceName = csvSourceNameInput.value.trim() || csvFileInput.files?.[0]?.name || "CSV import";
  const englishColumn = csvEnglishColumnSelect.selectedIndex;
  const japaneseColumn = csvJapaneseColumnSelect.selectedIndex;
  const hintColumn = csvHintColumnSelect.value ? csvHintColumnSelect.selectedIndex - 1 : -1;
  if (englishColumn < 0 || japaneseColumn < 0) {
    csvStatus.textContent = "Choose English and Japanese columns first.";
    return null;
  }
  return { sourceName, csvText, englishColumn, japaneseColumn, hintColumn };
}

function populateSelect(select, values, options = {}) {
  select.textContent = "";
  if (options.blankLabel) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = options.blankLabel;
    select.append(option);
  }
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  }
}

function selectLikelyField(select, candidates) {
  const option = Array.from(select.options).find((item) => {
    const value = item.value.toLowerCase();
    return candidates.some((candidate) => value.includes(candidate));
  });
  if (option) select.value = option.value;
}

async function loadSentencePool(options = {}) {
  const payload = await api("/api/sentences");
  sentencePool = Array.isArray(payload.sentences) ? payload.sentences : [];
  if (isDemoSentencesEnabled()) {
    sentencePool = [...sentencePool, ...demoSentences];
  }
  availablePracticeFilters = normalizePracticeFilters(payload.practiceFilters || collectPracticeFilters(sentencePool));
  if (isDemoSentencesEnabled()) {
    availablePracticeFilters = normalizePracticeFilters([
      ...availablePracticeFilters,
      { id: "demo:n5", label: "Demo N5", source: "demo" }
    ]);
  }
  renderJlptFilter(availablePracticeFilters, options);
}

function renderJlptFilter(filters, options = {}) {
  jlptFilterOptions.textContent = "";
  const normalizedFilters = normalizePracticeFilters(filters);
  availablePracticeFilters = normalizedFilters;
  jlptFilter.classList.toggle("hidden", normalizedFilters.length <= 1);

  const shouldReset = options.resetLevels || selectedPracticeFilters.size === 0;
  const selected = shouldReset
    ? new Set(normalizedFilters.map((filter) => filter.id))
    : new Set(normalizedFilters.map((filter) => filter.id).filter((id) => selectedPracticeFilters.has(id)));
  selectedPracticeFilters = selected.size > 0
    ? selected
    : new Set(normalizedFilters.map((filter) => filter.id));

  for (const filter of normalizedFilters) {
    const label = document.createElement("label");
    label.className = "jlpt-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = filter.id;
    checkbox.checked = selectedPracticeFilters.has(filter.id);

    label.append(checkbox, filter.label);
    jlptFilterOptions.append(label);
  }
}

function updateJlptFilterPreference(event) {
  const checkedInputs = Array.from(jlptFilterOptions.querySelectorAll("input:checked"));
  if (checkedInputs.length === 0 && event.target) {
    event.target.checked = true;
    checkedInputs.push(event.target);
  }
  selectedPracticeFilters = new Set(checkedInputs.map((input) => input.value));
  resetSessionForFilterChange();
  void showNextSentence();
}

function getFilteredSentences() {
  if (availablePracticeFilters.length <= 1) return sentencePool;
  return sentencePool.filter((sentence) => selectedPracticeFilters.has(getSentencePracticeFilterId(sentence)));
}

function collectPracticeFilters(sentences) {
  const filters = new Map();
  for (const sentence of sentences) {
    const id = getSentencePracticeFilterId(sentence);
    if (!id || filters.has(id)) continue;
    filters.set(id, {
      id,
      label: sentence.practiceFilterLabel || formatPracticeFilterLabel(sentence),
      source: sentence.source || ""
    });
  }
  return Array.from(filters.values());
}

function normalizePracticeFilters(filters) {
  const byId = new Map();
  for (const filter of filters) {
    if (typeof filter === "string") {
      const id = normalizeJlptLevel(filter);
      if (id) byId.set(id, { id, label: formatJlptLabel(id) });
      continue;
    }
    const id = String(filter?.id || "").trim();
    if (!id) continue;
    byId.set(id, {
      id,
      label: String(filter?.label || id),
      source: filter?.source || ""
    });
  }
  return Array.from(byId.values()).sort(comparePracticeFilters);
}

function getSentencePracticeFilterId(sentence) {
  if (sentence.practiceFilterId) return sentence.practiceFilterId;
  if (sentence.source === "demo") return "demo:n5";
  if (sentence.source === "csv") return `csv:${sentence.csvSourceName || sentence.sourceLabel || "CSV import"}`;
  if (sentence.source === "anki") return `anki:${sentence.ankiDeck || sentence.sourceLabel || sentence.grammarTitle || "Anki"}`;
  const level = normalizeJlptLevel(sentence.jlptLevel);
  return level ? `bunpro:${level}` : "bunpro:unknown";
}

function formatPracticeFilterLabel(sentence) {
  if (sentence.source === "demo") {
    return "Demo N5";
  }
  if (sentence.source === "csv") {
    return `CSV ${sentence.csvSourceName || sentence.sourceLabel || "import"}`;
  }
  if (sentence.source === "anki") {
    return `Anki ${sentence.ankiDeck || sentence.sourceLabel || sentence.grammarTitle || "deck"}`;
  }
  return `Bunpro ${formatJlptLabel(sentence.jlptLevel)}`;
}

function normalizeJlptLevel(level) {
  const value = String(level || "").trim().toUpperCase();
  const match = value.match(/N?([1-5])$/);
  return match ? `JLPT${match[1]}` : value;
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

function comparePracticeFilters(a, b) {
  const aSource = a.source || getPracticeSourceFromId(a.id);
  const bSource = b.source || getPracticeSourceFromId(b.id);
  if (aSource !== bSource) return getPracticeSourceOrder(aSource) - getPracticeSourceOrder(bSource);
  if (aSource === "bunpro") return compareJlptLevels(a.id.replace(/^bunpro:/, ""), b.id.replace(/^bunpro:/, ""));
  return a.label.localeCompare(b.label);
}

function getPracticeSourceFromId(id) {
  if (String(id || "").startsWith("bunpro:")) return "bunpro";
  if (String(id || "").startsWith("csv:")) return "csv";
  if (String(id || "").startsWith("demo:")) return "demo";
  return "anki";
}

function getPracticeSourceOrder(source) {
  return { bunpro: 0, anki: 1, csv: 2, demo: 3 }[source] ?? 4;
}

function formatJlptLabel(level) {
  return level.replace(/^JLPT([1-5])$/, "JLPT N$1");
}

function renderSessionEntry(entry, options = {}) {
  if (!entry) return;
  currentSentence = entry.sentence;
  const isRetry = entry.source === "retry";
  answerForm.classList.toggle("retry-active", isRetry);
  renderSentence(entry.sentence, { focus: options.focus === true });
  if (isRetry) {
    sourceContext.textContent = `Retry question - ${sourceContext.textContent}`;
  }
  answerInput.value = entry.answer || "";

  if (entry.grade) {
    renderGrade(entry.grade);
    drillInput.value = entry.drillAnswer || "";
    drillFeedback.textContent = entry.drillFeedback || "";
    drillFeedback.className = entry.drillFeedbackClass || "";
    renderDrillCompletion(entry);
  }

  updateNavigationState();
}

function renderSentence(sentence, options = {}) {
  resultPanel.classList.add("hidden");
  drillForm.classList.add("hidden");
  drillFeedback.textContent = "";
  currentCorrectAnswers = [];
  answerForm.classList.remove("correct-active");
  gradeButton.textContent = "Grade";
  drillButton.textContent = "Check";
  answerInput.value = "";
  drillInput.value = "";
  sourceContext.textContent = sentence.sourceContext || "From imported sentences";
  const usesPlainHint = sentence.source === "anki" || sentence.source === "csv" || sentence.source === "demo";
  grammarHint.classList.toggle("anki-hint", usesPlainHint);
  grammarHintMeta.classList.toggle("hidden", usesPlainHint);
  if (usesPlainHint) {
    grammarMeaning.textContent = sentence.grammarHint || sentence.grammarMeaning || "";
  } else {
    jlptLevel.textContent = sentence.jlptLevel || "-";
    grammarTitle.textContent = sentence.grammarTitle || "Grammar point";
    grammarMeaning.textContent = sentence.grammarMeaning || sentence.grammarHint || "";
  }
  englishPrompt.textContent = sentence.english || "";
  referenceJapanese.textContent = sentence.japanese || "";
  renderHintVisibility();
  if (options.focus !== false) answerInput.focus();
}

function renderEmptySentenceState() {
  currentSentence = null;
  currentCorrectAnswers = [];
  resultPanel.classList.add("hidden");
  drillForm.classList.add("hidden");
  answerForm.classList.remove("retry-active");
  answerForm.classList.remove("correct-active");
  gradeButton.textContent = "Grade";
  drillButton.textContent = "Check";
  sourceContext.textContent = "Import sentences to begin.";
  englishPrompt.textContent = "Import Bunpro, Anki, or CSV sentences to begin.";
  grammarMeaning.textContent = "";
  referenceJapanese.textContent = "";
  answerInput.value = "";
  drillInput.value = "";
  renderHintVisibility();
  updateNavigationState();
}

function renderGrade(result) {
  resultPanel.classList.remove("hidden");
  verdictPill.className = "";
  verdictPill.classList.add(result.verdict || "incorrect");
  verdictPill.textContent = result.verdict || "incorrect";
  scoreText.textContent = `${normalizeScore(result.score)} / 10`;
  feedbackText.textContent = result.feedback || "";
  referenceSentenceText.textContent = currentSentence?.japanese
    ? `Reference sentence: ${currentSentence.japanese}`
    : "";
  correctionText.textContent = result.correctedJapanese
    ? `Natural answer: ${result.correctedJapanese}`
    : "";
  currentCorrectAnswers = uniqueAnswers([
    currentSentence?.japanese || "",
    result.correctedJapanese || "",
    ...(Array.isArray(result.acceptedJapaneseAnswers) ? result.acceptedJapaneseAnswers : [])
  ]);
  renderDrill(result.verdict);
  const isCorrect = result.verdict === "correct";
  answerForm.classList.toggle("correct-active", isCorrect);
  if (isCorrect) {
    answerForm.classList.remove("retry-active");
    sourceContext.textContent = currentSentence?.sourceContext || "From imported sentences";
  }
  gradeButton.textContent = result.verdict === "correct" ? "Next" : "Grade";
}

function renderDrill(verdict) {
  drillInput.value = "";
  drillFeedback.textContent = "";
  drillFeedback.className = "";
  drillButton.textContent = "Check";
  if (verdict === "correct") {
    drillForm.classList.add("hidden");
    return;
  }
  drillForm.classList.remove("hidden");
}

function checkDrillAnswer(event) {
  event.preventDefault();
  const entry = getCurrentEntry();
  if (entry?.drillComplete) {
    void showNextSentence();
    return;
  }

  const typedAnswer = normalizeAnswer(drillInput.value);
  const matches = currentCorrectAnswers.some((answer) => normalizeAnswer(answer) === typedAnswer);

  if (matches) {
    if (entry) entry.drillComplete = true;
    drillFeedback.textContent = "Correct. Nice, lock it in.";
    drillFeedback.className = "drill-ok";
    drillButton.textContent = "Next";
    saveCurrentDraft();
    return;
  }

  if (entry) entry.drillComplete = false;
  drillFeedback.textContent = "Not quite. Use one of the correct answers and try again.";
  drillFeedback.className = "drill-miss";
  drillButton.textContent = "Check";
  saveCurrentDraft();
}

function createSessionEntry(sentence, options = {}) {
  return {
    id: nextSessionEntryId++,
    sentence,
    source: options.source || "random",
    retryOf: options.retryOf || null,
    retryDueAt: null,
    answer: "",
    grade: null,
    answered: false,
    drillAnswer: "",
    drillFeedback: "",
    drillFeedbackClass: "",
    drillComplete: false
  };
}

function resetSessionHistory() {
  sessionHistory = [];
  sessionIndex = -1;
  answeredThisSessionCount = 0;
  retryQueue = [];
  recentQuestionIds = [];
  renderAnsweredSessionCount();
  updateNavigationState();
  updateRetryStatus();
}

function resetSessionForFilterChange() {
  sessionHistory = [];
  sessionIndex = -1;
  recentQuestionIds = [];
  pruneRetryQueueForSelectedFilters();
  renderEmptySentenceState();
  renderAnsweredSessionCount();
  updateNavigationState();
  updateRetryStatus();
}

function getCurrentEntry() {
  return sessionHistory[sessionIndex] || null;
}

function markEntryAnswered(entry) {
  if (entry.answered) return;
  entry.answered = true;
  answeredThisSessionCount += 1;
  renderAnsweredSessionCount();
}

function renderAnsweredSessionCount() {
  answeredSessionCount.textContent = `Questions answered this session: ${answeredThisSessionCount}`;
}

function isCurrentAnswerCorrect() {
  return getCurrentEntry()?.grade?.verdict === "correct";
}

function saveCurrentDraft() {
  const entry = getCurrentEntry();
  if (!entry) return;
  entry.answer = answerInput.value;
  entry.drillAnswer = drillInput.value;
  entry.drillFeedback = drillFeedback.textContent;
  entry.drillFeedbackClass = drillFeedback.className;
}

function renderDrillCompletion(entry) {
  if (!entry?.grade || entry.grade.verdict === "correct") return;
  drillButton.textContent = entry.drillComplete ? "Next" : "Check";
}

function scheduleRetryForEntry(entry, result) {
  clearRetryForEntry(entry);
  if (result.verdict === "correct") {
    entry.retryDueAt = null;
    updateRetryStatus();
    updateNavigationState();
    return;
  }

  const dueAt = Date.now() + getRetryDelayMinutes() * 60 * 1000;
  entry.retryDueAt = dueAt;
  retryQueue.push({
    sourceEntryId: entry.id,
    sentence: entry.sentence,
    dueAt
  });
  retryQueue.sort((a, b) => a.dueAt - b.dueAt);
  updateRetryStatus();
  updateNavigationState();
}

function clearRetryForEntry(entry) {
  retryQueue = retryQueue.filter((retry) => retry.sourceEntryId !== entry.id);
}

function pruneRetryQueueForSelectedFilters() {
  retryQueue = retryQueue.filter((retry) => selectedPracticeFilters.has(getSentencePracticeFilterId(retry.sentence)));
}

function takeDueRetry() {
  const dueIndex = retryQueue.findIndex((retry) => retry.dueAt <= Date.now());
  if (dueIndex === -1) return null;
  const [retry] = retryQueue.splice(dueIndex, 1);
  return retry;
}

function takeNextRetry() {
  return retryQueue.shift() || null;
}

function hasDueRetry() {
  return retryQueue.some((retry) => retry.dueAt <= Date.now());
}

function normalizeScore(score) {
  const numericScore = Number(score || 0);
  const tenPointScore = numericScore > 10 ? numericScore / 10 : numericScore;
  return Math.max(0, Math.min(10, Math.round(tenPointScore)));
}

function normalizeAnswer(answer) {
  return String(answer || "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, "")
    .replace(/[（(][ぁ-んァ-ンー]+[）)]/g, "")
    .replace(/[、,，]/g, "")
    .replace(/[。.!！?？]+$/g, "");
}

function uniqueAnswers(answers) {
  const seen = new Set();
  const unique = [];
  for (const answer of answers) {
    const normalized = normalizeAnswer(answer);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    unique.push(answer);
  }
  return unique;
}

function initializeHintPreference() {
  hintToggle.checked = localStorage.getItem("bunproTrainer.showGrammarHints") === "true";
  renderHintVisibility();
}

function initializeRetryDelayPreference() {
  const savedDelay = Number(localStorage.getItem("bunproTrainer.retryDelayMinutes"));
  retryDelayInput.value = clampRetryDelay(savedDelay || 7);
  updateRetryStatus();
}

function initializeDemoSentencesPreference() {
  setDemoSentencesCheckboxes(isDemoSentencesEnabled());
  renderDemoSentencesStatus();
}

function updateHintPreference() {
  localStorage.setItem("bunproTrainer.showGrammarHints", String(hintToggle.checked));
  renderHintVisibility();
}

async function updateDemoSentencesPreference(event) {
  const isEnabled = event.target.checked;
  setDemoSentencesCheckboxes(isEnabled);
  localStorage.setItem(demoSentencesEnabledKey, String(isEnabled));
  renderDemoSentencesStatus();
  resetSessionHistory();
  try {
    const status = await api("/api/status");
    renderStatus(status);
    await loadSentencePool({ resetLevels: true });
    if (sentencePool.length > 0) {
      await showNextSentence();
    } else {
      renderEmptySentenceState();
    }
  } catch (error) {
    demoSentencesStatus.textContent = error.message;
  }
}

function isDemoSentencesEnabled() {
  return localStorage.getItem(demoSentencesEnabledKey) === "true";
}

function renderDemoSentencesStatus() {
  demoSentencesStatus.textContent = isDemoSentencesEnabled()
    ? `${demoSentences.length} demo sentences enabled.`
    : "Demo sentences disabled.";
}

function setDemoSentencesCheckboxes(isEnabled) {
  startDemoSentencesToggle.checked = isEnabled;
  demoSentencesToggle.checked = isEnabled;
}

function updateRetryDelayPreference() {
  const delay = clampRetryDelay(retryDelayInput.value);
  retryDelayInput.value = delay;
  localStorage.setItem("bunproTrainer.retryDelayMinutes", String(delay));
  updateRetryStatus();
}

function focusDrillFromAnswerOnTab(event) {
  if (event.key !== "Tab" || event.shiftKey || drillForm.classList.contains("hidden")) return;
  event.preventDefault();
  drillInput.focus();
}

function renderHintVisibility() {
  const hintText = String(currentSentence?.grammarHint || currentSentence?.grammarMeaning || "").trim();
  const usesPlainHint = currentSentence?.source === "anki" || currentSentence?.source === "csv" || currentSentence?.source === "demo";
  const hasVisibleHint = usesPlainHint ? Boolean(hintText) : Boolean(currentSentence);
  grammarHint.classList.toggle("hidden", !hintToggle.checked || !hasVisibleHint);
}

function getRetryDelayMinutes() {
  return clampRetryDelay(retryDelayInput.value);
}

function clampRetryDelay(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 7;
  return Math.max(1, Math.min(60, Math.round(numericValue)));
}

function updateRetryStatus() {
  if (retryQueue.length === 0) {
    retryStatus.textContent = "No retries waiting";
    updateNavigationState();
    return;
  }

  const dueCount = retryQueue.filter((retry) => retry.dueAt <= Date.now()).length;
  if (dueCount > 0) {
    retryStatus.textContent = `${dueCount} ${pluralize("retry", dueCount)} ready`;
    updateNavigationState();
    return;
  }

  const nextRetry = retryQueue[0];
  retryStatus.textContent = `${retryQueue.length} waiting, next in ${formatRemainingTime(nextRetry.dueAt - Date.now())}`;
  updateNavigationState();
}

function formatRemainingTime(milliseconds) {
  const seconds = Math.max(1, Math.ceil(milliseconds / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes}m`;
}

function pluralize(word, count) {
  return count === 1 ? word : `${word}s`;
}

function chooseRandom(items) {
  return items[Math.floor(Math.random() * items.length)] || null;
}

function chooseRandomQuestion(sentences) {
  const recentLimit = Math.max(0, Math.min(9, sentences.length - 1));
  if (recentLimit === 0) return chooseRandom(sentences);

  const blockedIds = new Set(recentQuestionIds.slice(-recentLimit));
  const candidates = sentences.filter((sentence) => !blockedIds.has(getSentenceQuestionId(sentence)));
  return chooseRandom(candidates.length > 0 ? candidates : sentences);
}

function rememberAskedSentence(sentence) {
  const id = getSentenceQuestionId(sentence);
  if (!id) return;
  recentQuestionIds.push(id);
  const maxTrackedQuestions = Math.max(0, Math.min(9, sentencePool.length - 1));
  if (maxTrackedQuestions === 0) {
    recentQuestionIds = [];
  } else if (recentQuestionIds.length > maxTrackedQuestions) {
    recentQuestionIds = recentQuestionIds.slice(-maxTrackedQuestions);
  }
}

function getSentenceQuestionId(sentence) {
  return String(sentence?.id || `${sentence?.source || ""}:${sentence?.english || ""}:${sentence?.japanese || ""}`);
}

function formatSyncTime(isoTimestamp) {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return "time unknown";
  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function setBusy(isBusy, message) {
  busy = isBusy;
  syncButton.disabled = isBusy;
  setAnkiControlsDisabled(isBusy || ankiBusy);
  setCsvControlsDisabled(isBusy || csvBusy);
  updateNavigationState();
  if (message) statusText.textContent = message;
  if (!isBusy && !message) restoreStatusText();
}

function setAnkiBusy(isBusy, message) {
  ankiBusy = isBusy;
  setAnkiControlsDisabled(isBusy || busy);
  if (message) ankiStatus.textContent = message;
}

function setAnkiControlsDisabled(isDisabled) {
  ankiConnectButton.disabled = isDisabled;
  ankiDeckSelect.disabled = isDisabled;
  ankiEnglishFieldSelect.disabled = isDisabled;
  ankiJapaneseFieldSelect.disabled = isDisabled;
  ankiGrammarHintFieldSelect.disabled = isDisabled;
  ankiPreviewButton.disabled = isDisabled;
  ankiImportButton.disabled = isDisabled;
}

function setCsvBusy(isBusy, message) {
  csvBusy = isBusy;
  setCsvControlsDisabled(isBusy || busy);
  if (message) csvStatus.textContent = message;
}

function setCsvControlsDisabled(isDisabled) {
  const hasCsvText = Boolean(csvText);
  const hasColumns = !csvColumnFields.classList.contains("hidden");
  csvFileInput.disabled = isDisabled;
  csvSourceNameInput.disabled = isDisabled || !hasCsvText;
  csvEnglishColumnSelect.disabled = isDisabled || !hasColumns;
  csvJapaneseColumnSelect.disabled = isDisabled || !hasColumns;
  csvHintColumnSelect.disabled = isDisabled || !hasColumns;
  csvPreviewButton.disabled = isDisabled || !hasCsvText;
  csvImportButton.disabled = isDisabled || !hasCsvText || !hasColumns;
}

function setSettingsBusy(isBusy, message) {
  saveBunproTokenButton.disabled = isBusy;
  saveLlmSettingsButton.disabled = isBusy;
  saveFeedbackSettingsButton.disabled = isBusy;
  if (message) {
    if (message.includes("Bunpro")) bunproSettingsStatus.textContent = message;
    if (message.includes("LLM")) llmSettingsStatus.textContent = message;
    if (message.includes("model personalisation")) feedbackSettingsStatus.textContent = message;
  }
}

function restoreStatusText() {
  if (lastStatusText) statusText.textContent = lastStatusText;
}

function updateNavigationState() {
  previousButton.disabled = busy || sessionIndex <= 0;
  skipMissedButton.disabled = busy || retryQueue.length === 0;
  nextButton.disabled = busy;
  const atLatest = sessionIndex >= sessionHistory.length - 1;
  nextButton.textContent = atLatest && hasDueRetry() ? "Retry" : "Next";
}

async function api(path, options = {}) {
  const response = await fetch(path, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.detail ? `${payload.error}: ${payload.detail}` : payload.error || response.statusText);
  }
  return payload;
}
