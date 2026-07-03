# Bunpro Full Sentence Trainer Commands

<button onclick="navigator.clipboard.writeText(document.getElementById('copy-all-commands').innerText)">Copy all commands</button>

> Some markdown viewers disable inline JavaScript. If the button above does nothing, use the copy button on each fenced code block.

## Enter The Project

```sh
cd bunpro-full-sentence-trainer
```

## Start The Server

```sh
npm start
```

Then open:

```text
http://127.0.0.1:5174
```

Use **Sources & Settings** in the browser to save LLM, Bunpro, Anki, and model personalisation settings. This writes `.env`. Do not commit `.env` to GitHub.

## Stop The Server

If the server is running in your terminal:

```text
Ctrl-C
```

If it was started in the background:

```sh
lsof -i :5174
kill <PID>
```

## Restart After Editing `.env`

```text
Ctrl-C
```

```sh
npm start
```

The server reads `.env` only at startup.

## Check Local App Status

```sh
curl -L -s http://127.0.0.1:5174/api/status
```

You want to see:

```json
{
  "hasBunproToken": true,
  "hasLlmCredentials": true
}
```

## Sync Bunpro

```sh
curl -L -s -X POST http://127.0.0.1:5174/api/sync
```

## Get The Synced Sentence Pool

```sh
curl -L -s http://127.0.0.1:5174/api/sentences
```

## Get A Random Prompt

```sh
curl -L -s http://127.0.0.1:5174/api/random
```

## Check LLM API Key

This reads `LLM_BASE_URL` and `LLM_API_KEY` from `.env` and does not print the key.

```sh
node -e '
const fs = require("fs");
const env = Object.fromEntries(
  fs.readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .filter(line => line.trim() && !line.trim().startsWith("#") && line.includes("="))
    .map(line => {
      const i = line.indexOf("=");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    })
);

const baseUrl = (env.LLM_BASE_URL || env.OPENAI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai").replace(/\/+$/, "");
const apiKey = env.LLM_API_KEY || env.OPENAI_API_KEY || "";
const headers = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};

fetch(`${baseUrl}/models`, { headers }).then(r => console.log({ status: r.status, ok: r.ok }));
'
```

Expected result:

```text
{ status: 200, ok: true }
```

## `.env` Shape

Do not put real keys in this markdown file. Put them in `.env`.

Default Gemini example:

```sh
BUNPRO_API_TOKEN=your_bunpro_token
LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
LLM_API_KEY=your_gemini_api_key
LLM_MODEL=gemini-3.5-flash
LLM_FEEDBACK_LANGUAGE=english
LLM_CUSTOM_INSTRUCTIONS=
PORT=5174
ANKI_CONNECT_URL=http://127.0.0.1:8765
```

OpenAI example:

```sh
BUNPRO_API_TOKEN=your_bunpro_token
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=your_openai_api_key
LLM_MODEL=gpt-5.4-mini
LLM_FEEDBACK_LANGUAGE=english
LLM_CUSTOM_INSTRUCTIONS=
PORT=5174
ANKI_CONNECT_URL=http://127.0.0.1:8765
```

## Copy-All Source

The block below is what the top button copies.

<pre id="copy-all-commands"><code>cd bunpro-full-sentence-trainer
npm start

# Open http://127.0.0.1:5174

# Stop foreground server:
# Ctrl-C

# Stop background server:
lsof -i :5174
kill &lt;PID&gt;

# Local app status:
curl -L -s http://127.0.0.1:5174/api/status

# Sync Bunpro:
curl -L -s -X POST http://127.0.0.1:5174/api/sync

# Synced sentence pool:
curl -L -s http://127.0.0.1:5174/api/sentences

# Random prompt:
curl -L -s http://127.0.0.1:5174/api/random

# LLM key check:
node -e '
const fs = require("fs");
const env = Object.fromEntries(
  fs.readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .filter(line =&gt; line.trim() &amp;&amp; !line.trim().startsWith("#") &amp;&amp; line.includes("="))
    .map(line =&gt; {
      const i = line.indexOf("=");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    })
);

const baseUrl = (env.LLM_BASE_URL || env.OPENAI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai").replace(/\/+$/, "");
const apiKey = env.LLM_API_KEY || env.OPENAI_API_KEY || "";
const headers = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};

fetch(`${baseUrl}/models`, { headers }).then(r =&gt; console.log({ status: r.status, ok: r.ok }));
'</code></pre>
