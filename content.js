let lastUrl = location.href;

function addUrlToLog(url) {
  chrome.storage.local.get(["logEntries"], (data) => {
    const log = data.logEntries || [];
    if (log[log.length - 1] !== url) {
      log.push(url);
      chrome.storage.local.set({ logEntries: log });
    }
  });
}

function incrementCounter(key) {
  chrome.storage.local.get([key], (data) => {
    const newCount = (data[key] || 0) + 1;
    const update = {};
    update[key] = newCount;
    chrome.storage.local.set(update);
  });
}

// Detect navigation changes
setInterval(() => {
  chrome.storage.local.get(["monitoring"], (data) => {
    if (!data.monitoring) return;

    if (location.href !== lastUrl) {
      lastUrl = location.href;
      incrementCounter("screenCount");
      addUrlToLog(location.href);
    }
  });
}, 1500);

// Monitor API calls
(function () {
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    const url = arguments[1];
    chrome.storage.local.get(["monitoring"], (data) => {
      if (data.monitoring && url && url.includes("http") && !url.includes(location.host)) {
        incrementCounter("apiCount");
      }
    });
    return originalOpen.apply(this, arguments);
  };
})();