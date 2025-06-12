// Detect navigation as screen change
let lastUrl = location.href;
setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    chrome.storage.local.get(["screenCount"], (data) => {
      const newCount = (data.screenCount || 0) + 1;
      chrome.storage.local.set({ screenCount: newCount });
    });
  }
}, 1500);

// Detect API calls
(function() {
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    const url = arguments[1];
    if (url && url.includes("http") && !url.includes(location.host)) {
      chrome.storage.local.get(["apiCount"], (data) => {
        const newCount = (data.apiCount || 0) + 1;
        chrome.storage.local.set({ apiCount: newCount });
      });
    }
    return open.apply(this, arguments);
  };
})();