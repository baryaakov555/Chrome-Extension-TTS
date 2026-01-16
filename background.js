const GEMINI_API_KEY = "AIzaSyC2pok1d8DPgKUn-SsefsiqJ8GxYQ8cZiU";
const GEMINI_MODEL = "models/gemini-2.5-flash";

// When the user clicks the extension icon, tell the tab to run Gemini
chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;
  chrome.tabs.sendMessage(tab.id, { type: "RUN_GEMINI" });
});

// Handle messages from content.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "PAGE_TEXT") {
    handlePageText(msg.text);
  }
});

// Call Gemini 2.5 Flash with the page text
async function callGeminiForScreenReader(pageText) {
  const MAX_CHARS = 12000;
  const trimmed = pageText.slice(0, MAX_CHARS);

  const prompt =
    "You are a screen reader helper for a blind user. " +
    "Summarize this web page in clear spoken language. " +
    "Describe the main topic, key sections, and anything visually important " +
    "(like images, diagrams or tables) *based on the text you see*. " +
    "Speak as if you are reading it out loud to a human, not like a bullet list.\n\n" +
    "PAGE TEXT:\n" +
    trimmed;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

async function handlePageText(pageText) {
  try {
    const result = await callGeminiForScreenReader(pageText);

    const parts = result?.candidates?.[0]?.content?.parts || [];

    const text =
      parts
        .map((p) => p.text || "")
        .join(" ")
        .trim() || "I couldn't generate a description for this page.";

    console.log("Gemini screen-reader output:", text);

    // Read it out loud
    chrome.tts.speak(text, {
      rate: 1,
      pitch: 1,
      lang: "en-US",
    });
  } catch (err) {
    console.error("Gemini error:", err);
    chrome.tts.speak("Sorry, I had a problem generating the description.", {
      lang: "en-US",
    });
  }
}
