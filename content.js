let isActivated = false;

function activateInterceptors() {
  if (isActivated) return;
  isActivated = true;

  try {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('interceptor.js');
    (document.head || document.documentElement).appendChild(script);
    script.onload = () => script.remove();
    console.log('AO Estimator: Interceptor script injected.');
  } catch (e) {
    console.error('AO Estimator: Error injecting script:', e);
  }
}

window.addEventListener('message', (event) => {
  if (event.source !== window || !event.data || event.data.type !== 'AO_ESTIMATOR_FETCH') {
    return;
  }
  
  if (!chrome.runtime || !chrome.runtime.id) return;

  const { url, options } = event.data.payload;

  chrome.storage.local.get('monitoring', (data) => {
    if (chrome.runtime.lastError || !data || !data.monitoring) return;

    if (url.includes("http")) {
      if (url.includes(location.host)) {
        // It's an internal API call (location)
        addItemToStorage('internalApiUrls', new URL(url).pathname);
      } else {
        // It's an external integration (url.pathname)
        addItemToStorage('integrationUrls', url);
      }
    }

    if (options.body) {
      checkForGraphQL(options.body);
    }
  });
});

function addItemToStorage(key, item) {
  if (!chrome.runtime || !chrome.runtime.id) return;

  chrome.storage.local.get([key], (result) => {
    if (chrome.runtime.lastError) return;
    const currentItems = result[key] || [];
    // Avoid adding duplicates
    if (!currentItems.includes(item)) {
        const newItems = [...currentItems, item];
        chrome.storage.local.set({ [key]: newItems });
    }
  });
}

function checkForGraphQL(body) {
    if (!body) return;
    try {
      const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
      if (parsedBody && (parsedBody.query || parsedBody.operationName)) {
        // We will just count the number of queries, not store the body
        chrome.storage.local.get('detectedQueries', (res) => {
            if(chrome.runtime.lastError) return;
            const count = (res.detectedQueries || 0) + 1;
            chrome.storage.local.set({ detectedQueries: count });
        });
      }
    } catch (e) { /* Not a JSON body, ignore */ }
}

// --- Activation Logic By ielito, the fofo ---
if (chrome.runtime && chrome.runtime.id) {
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === "ACTIVATE_MONITORING") {
            activateInterceptors();
        }
    });
    chrome.storage.local.get("monitoring", (data) => {
        if (chrome.runtime.lastError) return;
        if (data && data.monitoring === true) {
            activateInterceptors();
        }
    });
}