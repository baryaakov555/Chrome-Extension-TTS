// Listen for the background script telling it to run
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "RUN_GEMINI") {
    sendPageTextToBackground();
  }
});

function sendPageTextToBackground() {
  const text = document.body?.innerText || "";

  console.log("Sending page text to background, length:", text.length);

  chrome.runtime.sendMessage({
    type: "PAGE_TEXT",
    text,
  });
}
