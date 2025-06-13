// 1. Initialize storage on first installation OR when reloaded by the Reset button
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    monitoring: false,
    logEntries: [],
    integrationUrls: [],
    internalApiUrls: [],
    detectedQueries: 0,
    tables: 0
  });
});

// 2. Listen for navigation events to log screens
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  // Ignore iframes (by now, maybe, or not hahaha), only track the main page navigation
  if (details.frameId !== 0) {
    return;
  }

  chrome.storage.local.get(["monitoring", "logEntries"], (data) => {
    // Check if monitoring is active before proceeding
    if (chrome.runtime.lastError || !data || !data.monitoring) return;

    // Add the new URL to the log. The popup will handle uniqueness.
    const newLog = [...data.logEntries, details.url];
    chrome.storage.local.set({ logEntries: newLog });
  });
}, { url: [{ schemes: ['http', 'https'] }] }); // Only for web pages