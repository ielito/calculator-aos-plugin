// background.js

// 1. Initialize storage on first installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
      monitoring: false,
      logEntries: [],
      integrationUrls: [],
      detectedQueries: [],
      tables: 0
    });
  });
  
  // 2. Listen for navigation events to log screens
  chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    // Ignore iframes, only track the main page navigation
    if (details.frameId !== 0) {
      return;
    }
  
    chrome.storage.local.get(["monitoring", "logEntries"], (data) => {
      if (data.monitoring === true) {
        // Add the new URL to the log. The popup will handle uniqueness.
        const newLog = [...data.logEntries, details.url];
        chrome.storage.local.set({ logEntries: newLog });
      }
    });
  }, { url: [{ schemes: ['http', 'https'] }] }); // Only for web pages