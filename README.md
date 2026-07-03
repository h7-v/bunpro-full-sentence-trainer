# Japanese Full Sentence Trainer

A local practice app for full-sentence Japanese translation practice.

It imports sentences from Bunpro, Anki, or CSV files, shows you an English sentence, asks you to type the Japanese, and uses an LLM to grade whether your answer is good enough. Missed answers can be retried in the same session.

The Bunpro importer uses an unofficial Bunpro API. Bunpro can change their frontend API at any time.

## Screenshots

![Practice prompt](docs/images/01.png)

![Correct answer feedback](docs/images/02.png)

![Incorrect answer with retry drill](docs/images/03.png)

![Grammar hints and grading feedback](docs/images/04.png)

## Before You Start

You need:

- Node.js 18 or newer
- A Gemini API key for the default free provider
- At least one sentence source: Bunpro, Anki, or CSV

For Bunpro import, you need a Bunpro account and Bunpro token. For Anki import, you need Anki desktop and the AnkiConnect add-on. For CSV import, you need a CSV file with English and Japanese columns.

You do not need to understand programming to run this app, but you do need to paste a few commands into a command window.

By default, the app uses Gemini with `gemini-3.5-flash` because Gemini has a free API tier. The grader uses a Chat Completions-compatible endpoint, so advanced users can also point it at OpenAI, another OpenAI-compatible provider, or a local model server if it can return JSON reliably.

Important: ChatGPT Plus/Pro and OpenAI API billing are separate. A ChatGPT subscription does not pay for OpenAI API grading. If you choose OpenAI and grading fails with a quota error, you probably need to add API credit in the OpenAI developer billing page.

## What Is A Terminal?

A terminal is just a command window where you type short commands and press Enter.

On Windows, use one of these:

- **Terminal**
- **Command Prompt**
- **PowerShell**

Open it from the Start menu by searching for one of those names.

On macOS, use **Terminal**. Open it from:

```text
Applications -> Utilities -> Terminal
```

or press Command-Space, type `Terminal`, and press Enter.

## Install Node.js

Node.js lets your computer run this local app. It also installs `npm`, which is the command used to start the app.

1. Go to [nodejs.org](https://nodejs.org/).
2. Download the **LTS** version.
3. Run the installer.
4. Accept the default options.
5. When the installer finishes, close any terminal windows that are already open.
6. Open a new terminal.
7. Type this and press Enter:

```sh
node -v
```

Then type this and press Enter:

```sh
npm -v
```

If both commands print version numbers, Node.js is ready.

If Windows says `node` or `npm` is not recognized:

1. Close the terminal and open a new one.
2. If that does not work, restart your computer.
3. If it still does not work, reinstall Node.js from [nodejs.org](https://nodejs.org/) and make sure any option like **Add to PATH** is enabled.
4. You can also try opening **Node.js command prompt** from the Windows Start menu.

## Download The App

If you do not use Git, use the ZIP download:

1. Open the GitHub page for this project.
2. Click the green **Code** button.
3. Click **Download ZIP**.
4. Unzip the downloaded file.
5. Open the unzipped folder.

The folder is probably called something like:

```text
bunpro-full-sentence-trainer
```

If you are comfortable with Git, you can use:

```sh
git clone https://github.com/h7-v/bunpro-full-sentence-trainer.git
cd bunpro-full-sentence-trainer
```

## Open A Terminal In The App Folder

The terminal needs to be looking at the app folder before the start commands will work.

### Windows

1. Open the unzipped app folder.
2. Click the address bar at the top of File Explorer.
3. Type `cmd`.
4. Press Enter.

A Command Prompt window should open inside that folder.

If that does not work:

1. Open **Terminal**, **Command Prompt**, or **PowerShell** from the Start menu.
2. Type `cd ` with a space after it.
3. Drag the app folder into the terminal window.
4. Press Enter.

### macOS

Try this first:

1. Right click the app folder.
2. Click **New Terminal at Folder**.

If you do not see that option:

1. Open **Terminal**.
2. Type `cd ` with a space after it.
3. Drag the app folder into the Terminal window.
4. Press Enter.

## Get A Bunpro Token

Bunpro does not currently document this frontend API for third-party apps, so this part is more awkward than the rest.

1. Log in to [bunpro.jp](https://bunpro.jp/).
2. Open your browser developer tools.
   - Chrome or Edge: right click the page, click **Inspect**, then click the **Network** tab.
   - Firefox: right click the page, click **Inspect**, then click the **Network** tab.
3. Refresh Bunpro while the Network tab is open.
4. Click a request such as `user`, `queue`, `due`, or `srs_level_overview`. On Chrome, the type is a `fetch`.
5. Look for **Request Headers**.
6. Find the `authorization` header. It looks like this:

```text
Token token=your_bunpro_token_here
```

7. Copy only the part after `token=`.

Example:

```text
Token token=abc123
```

The Bunpro token value is:

```text
abc123
```

Important: Bunpro warns that this token can give third-party apps read and write access to your Bunpro data. This app only uses read-oriented endpoints, but you should still treat the token like a password.

## Choose An LLM Provider

The app grades answers through an OpenAI-compatible Chat Completions endpoint.

Most users should use the default Gemini setup:

```sh
LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
LLM_API_KEY=your_gemini_api_key_here
LLM_MODEL=gemini-3.5-flash
```

To use OpenAI instead:

```sh
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-5.4-mini
```

You can also try a local provider if it exposes an OpenAI-compatible API, for example:

```sh
LLM_BASE_URL=http://localhost:11434/v1
LLM_API_KEY=dummy
LLM_MODEL=your_local_model_name
```

Local model quality varies. For this app, the model needs to understand English and Japanese, follow grading instructions, and return valid JSON.

## Get A Gemini API Key

Gemini is the recommended default because it has a free API tier. Skip this section only if you are using OpenAI or a local provider instead.

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Sign in.
3. Create a Gemini API key. One should be created for you and listed as the "Default Gemini API Key".
4. Click the key link (e.g.: ...sl2Q). Copy the full API key somewhere temporary so you can paste it into the app.

## Using OpenAI Instead

If you prefer OpenAI, use these values in **Sources & Settings** or in `.env`:

```sh
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-5.4-mini
```

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys).
2. Sign in.
3. Create a new secret key.
4. Copy the key somewhere temporary so you can paste it into the app.

Important: The OpenAI API is billed through the OpenAI developer platform. It is not included with ChatGPT Plus/Pro.

If you use OpenAI and the app says grading failed because of quota:

1. Go to the OpenAI developer billing page.
2. Add a small amount of credit, such as 5 USD.
3. Try grading again.

About 5 USD should cover roughly 2,000 graded questions, depending on the model and how long the sentences are.

## Start The App

In the terminal that is open in the app folder, type:

```sh
npm start
```

Press Enter.

Then open this address in your browser:

```text
http://127.0.0.1:5174
```

Leave the terminal window open while you use the app. If you close it, the app stops.

This project has no npm package dependencies. You do not need to run `npm install`.

## Set Up The App

The first time you open the browser page, the app shows **Sources & Settings**.

1. Open **LLM** and save your LLM base URL, API key, and model.
2. Open **Bunpro** and save your Bunpro token, or open **Anki** and import an Anki deck.
3. Start practicing once at least one source has imported sentences.

The browser settings form writes a local `.env` file and clears secret fields after saving. Do not share `.env`; it contains your private tokens.

If you use browser extensions that can read every page you visit, manual `.env` editing is more private because keys are never typed into the browser.

## Stop The App

Click the terminal window and press:

```text
Ctrl-C
```

On macOS, this is still Control-C, not Command-C.

If you edit `.env`, stop and restart the app. The app reads `.env` only when it starts.

## Optional: Import Anki Sentence Cards

The app can also read sentence cards from Anki through AnkiConnect. This is useful if you have cards with one field for English and one field for Japanese.

This does not write anything to Anki. It only reads notes, extracts sentence pairs, and stores local deck-specific cache files such as `cache/anki-deck-...json`.

### Install AnkiConnect

1. Install Anki desktop from [apps.ankiweb.net](https://apps.ankiweb.net/) if you do not already have it.
2. Open Anki.
3. Install the AnkiConnect add-on from [ankiweb.net/shared/info/2055492159](https://ankiweb.net/shared/info/2055492159).
4. Restart Anki after installing the add-on.
5. Keep Anki open while importing cards.

The default AnkiConnect address is:

```sh
ANKI_CONNECT_URL=http://127.0.0.1:8765
```

## Optional: Import CSV Sentence Files

The app can import sentence pairs from a CSV file exported from Excel, Google Sheets, or another spreadsheet app.

Your CSV should have a header row and at least two columns:

- English sentence
- Japanese sentence
- Optional hint

Example:

```csv
English,Japanese,Hint
The sea is beautiful.,海が綺麗だ,い-adjective / な-adjective practice
I went to Tokyo yesterday.,昨日東京に行きました,Past tense
```

In the browser:

1. Open **Sources & Settings**.
2. Open **CSV File**.
3. Choose your CSV file.
4. Select the English, Japanese, and optional hint columns.
5. Preview the import.
6. Click **Import**.

CSV imports are capped at 5,000 rows and 2 MB. Very long fields are shortened before saving so an accidental huge spreadsheet cell cannot take over the app.

This is already the app default. You only need to put it in `.env` if you changed your AnkiConnect settings.

### Import From Anki

1. Start the trainer with `npm start`.
2. Open `http://127.0.0.1:5174`.
3. Open **Anki import**.
4. Click **Connect Anki**.
5. Choose your deck.
6. Choose the field that contains the English sentence.
7. Choose the field that contains the Japanese sentence.
8. Optionally choose a field that contains a grammar hint.
9. Click **Preview** to check the first imported sentence pairs.
10. Click **Import**.

Imported Anki sentences appear in the normal practice flow alongside Bunpro sentences. In the practice filters, each Anki deck appears separately.

If your Anki cards have HTML, audio tags, or cloze markers, the app tries to clean those out before training.

## How Sync Works

When you click **Import Bunpro**, the app:

- asks Bunpro for your studied grammar points
- downloads example sentences for those grammar points
- stores a local cache in `cache/bunpro-sync.json`

If you have advanced further into your Bunpro decks, sync again to add the new grammar points.

The cache is ignored by Git and can be safely deleted. Sync again to rebuild it.

## Features

- Syncs studied Bunpro grammar points
- Imports sentence cards from Anki through AnkiConnect
- Pulls example sentences for known grammar
- Filters practice by Bunpro JLPT level or Anki deck
- Grades answers with an LLM through a Chat Completions-compatible API
- Accepts natural answers, not just exact Bunpro wording
- Uses model-provided accepted answer variants (Kana vs Kanji) for the no-API drill step
- Keeps a session history with Previous/Next
- Schedules missed answers for short-term (default is 7 minutes) retry
- Lets you skip directly to missed answers before ending a session

## Troubleshooting

### `node` or `npm` is not found

Install Node.js from [nodejs.org](https://nodejs.org/), then close and reopen your terminal.

On Windows, also try:

- Restarting your computer
- Opening **Node.js command prompt** from the Start menu
- Reinstalling Node.js and enabling **Add to PATH** if the installer shows that option

### The page says the Bunpro token is missing

Open **Sources & Settings**, go to **Bunpro**, save your Bunpro token, then try importing again.

### The page says the LLM key is missing

Open **Sources & Settings**, go to **LLM**, save your LLM API key, then try grading again. If you are using a local provider that does not require a key, make sure `LLM_BASE_URL` points to a local address such as `http://localhost:11434/v1`.

### Gemini grading failed

Check that:

- your `.env` file has `LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai`
- your `.env` file has `LLM_MODEL=gemini-3.5-flash`
- your `LLM_API_KEY` value is a Gemini API key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- you stopped and restarted the app after editing `.env`

### OpenAI grading failed because of quota

This usually means your OpenAI developer account does not have API credit available.

ChatGPT Plus/Pro does not include API usage. Add billing credit in the OpenAI developer dashboard. About 5 USD should cover roughly 2,000 graded questions, depending on model prices and answer length.

### The browser page will not open

Make sure `npm start` is still running in the terminal. Then open:

```text
http://127.0.0.1:5174
```

If you changed the local port in `.env`, use that port number instead of `5174`.

### Bunpro sync fails

The Bunpro frontend API is unofficial. The endpoint names, token behavior, or response shapes may change.

### Anki import cannot connect

Check that:

- Anki desktop is open
- AnkiConnect is installed
- Anki was restarted after installing AnkiConnect
- `.env` has the correct `ANKI_CONNECT_URL` if you changed the default AnkiConnect port

The default is:

```sh
ANKI_CONNECT_URL=http://127.0.0.1:8765
```

## Privacy

This app runs locally on your computer. Bunpro and LLM requests are made by the local Node server, not directly by browser JavaScript.

The in-browser settings forms send keys to the local server so it can write `.env`. They do not store keys in local storage or show saved secret values again. A browser extension with permission to read all page content may still see values while you type them, so use manual `.env` editing if that is a concern.

Do not share:

- `.env`
- your Bunpro token
- your LLM or OpenAI API key
- `cache/bunpro-sync.json`, if you consider your studied grammar data private
- `cache/anki-deck-*.json`, if you consider your imported Anki sentences private

## Manual `.env` Setup

Most users should use the browser setup. Advanced users can create `.env` manually:

```sh
BUNPRO_API_TOKEN=your_bunpro_token_here
LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
LLM_API_KEY=your_gemini_api_key_here
LLM_MODEL=gemini-3.5-flash
LLM_FEEDBACK_LANGUAGE=english
LLM_CUSTOM_INSTRUCTIONS=
PORT=5174
ANKI_CONNECT_URL=http://127.0.0.1:8765
```

OpenAI example:

```sh
BUNPRO_API_TOKEN=your_bunpro_token_here
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-5.4-mini
LLM_FEEDBACK_LANGUAGE=english
LLM_CUSTOM_INSTRUCTIONS=
PORT=5174
ANKI_CONNECT_URL=http://127.0.0.1:8765
```

Older `.env` files that use `OPENAI_API_KEY`, `OPENAI_MODEL`, or `OPENAI_BASE_URL` still work, but new setups should use the `LLM_*` names.
