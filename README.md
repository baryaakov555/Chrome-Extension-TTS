# Gemini Screen Reader (Chrome Extension)

A Manifest V3 Chrome extension prototype that helps blind / low-vision users by:
1) extracting the visible page text from the current tab,
2) sending it to Google Gemini (Gemini 2.5 Flash),
3) reading Gemini’s summary out loud using Chrome Text-to-Speech (TTS).

This is a research/demo project and runs fully in the browser (no backend server).

---

## Features

- **One-click “describe page”**: click the extension icon to generate a spoken description of the current page.
- **Text extraction in content script**: uses `document.body.innerText` from the active page.
- **Gemini summarization**: calls `models/gemini-2.5-flash` using `generateContent`.
- **Speech output**: reads the result aloud using `chrome.tts.speak()`.

---

## How it works (Architecture)

- `content.js` (runs inside the webpage)
  - extracts page text using `document.body.innerText`
  - sends it to background via `chrome.runtime.sendMessage({ type: "PAGE_TEXT", text })`

- `background.js` (service worker, extension context)
  - receives the text
  - calls Gemini `generateContent`
  - reads the response out loud using Chrome TTS

---

## Installation (Developer Mode)

1. Download or clone this repo.
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked**.
5. Select the folder that contains `manifest.json`.

---

## Setup (Gemini API Key)

This project requires a Gemini API key.

Open `background.js` and set:

```js
const GEMINI_API_KEY = "YOUR_API_KEY_HERE";
