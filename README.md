# Bunpro Full Sentence Trainer

A local practice app for Bunpro grammar sentences.

It syncs grammar points you have studied in Bunpro, shows you an English sentence, asks you to type the Japanese, and uses an OpenAI model to grade whether your answer is good enough. Missed answers can be retried in the same session.

This is an unofficial Bunpro API experiment. Bunpro can change their frontend API at any time.

## Before You Start

You need four things:

- A Bunpro account
- A Bunpro API token
- An OpenAI API key
- Node.js 18 or newer

You do not need to understand programming to run this app, but you do need to paste a few commands into a command window.

Important: ChatGPT Plus/Pro and OpenAI API billing are separate. A ChatGPT subscription does not pay for this app's OpenAI grading. If grading fails with a quota error, you probably need to add API credit in the OpenAI developer billing page. Adding about 5 USD should be enough for roughly 2,000 graded questions, depending on model prices and answer length.

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

## Get An OpenAI API Key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys).
2. Sign in.
3. Create a new secret key.
4. Copy the key somewhere temporary so you can paste it during setup.

Important: The OpenAI API is billed through the OpenAI developer platform. It is not included with ChatGPT Plus/Pro.

If the app says OpenAI grading failed because of quota:

1. Go to the OpenAI developer billing page.
2. Add a small amount of credit, such as 5 USD.
3. Try grading again.

About 5 USD should cover roughly 2,000 graded questions, depending on the model and how long the sentences are.

## Set Up The App

In the terminal that is open in the app folder, type:

```sh
npm run setup
```

Press Enter.

The setup script asks for:

- Bunpro API token
- OpenAI API key
- OpenAI model
- Local port

For **OpenAI model**, press Enter to use the default setting.

For **Local port**, press Enter to use the default setting.

The setup script writes a local `.env` file. Do not share that file. It contains your private tokens.

## Start The App

In the same terminal, type:

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

## Stop The App

Click the terminal window and press:

```text
Ctrl-C
```

On macOS, this is still Control-C, not Command-C.

If you edit `.env`, stop and restart the app. The app reads `.env` only when it starts.

## How Sync Works

When you click **Sync Bunpro**, the app:

- asks Bunpro for your studied grammar points
- downloads example sentences for those grammar points
- stores a local cache in `cache/bunpro-sync.json`

If you have advanced further into your Bunpro decks, sync again to add the new grammar points.

The cache is ignored by Git and can be safely deleted. Sync again to rebuild it.

## Features

- Syncs studied Bunpro grammar points
- Pulls example sentences for known grammar
- Filters practice by available JLPT levels
- Grades answers with an OpenAI model
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

Run this again:

```sh
npm run setup
```

Then paste your Bunpro token when asked.

### The page says the OpenAI key is missing

Run this again:

```sh
npm run setup
```

Then paste your OpenAI API key when asked.

### OpenAI grading failed because of quota

This usually means your OpenAI developer account does not have API credit available.

ChatGPT Plus/Pro does not include API usage. Add billing credit in the OpenAI developer dashboard. About 5 USD should cover roughly 2,000 graded questions, depending on model prices and answer length.

### The browser page will not open

Make sure `npm start` is still running in the terminal. Then open:

```text
http://127.0.0.1:5174
```

If you changed the local port during setup, use that port number instead of `5174`.

### Bunpro sync fails

The Bunpro frontend API is unofficial. The endpoint names, token behavior, or response shapes may change.

## Privacy

This app runs locally on your computer. Bunpro and OpenAI requests are made by the local Node server, not directly by browser JavaScript.

Do not share:

- `.env`
- your Bunpro token
- your OpenAI API key
- `cache/bunpro-sync.json`, if you consider your studied grammar data private

## Manual `.env` Setup

Most users should use:

```sh
npm run setup
```

Advanced users can create `.env` manually:

```sh
BUNPRO_API_TOKEN=your_bunpro_token_here
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.4-mini
PORT=5174
```
