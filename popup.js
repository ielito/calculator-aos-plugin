// popup.js - Displays internal APIs and adds them to export

document.addEventListener("DOMContentLoaded", () => {
  // UI Elements
  const screenCountEl = document.getElementById("screenCount");
  const integrationCountEl = document.getElementById("integrationCount");
  const queryCountEl = document.getElementById("queryCount");
  const tablesInput = document.getElementById("tables");
  const totalEl = document.getElementById("total");
  const screenLogList = document.getElementById("screenLogList");
  const integrationLogList = document.getElementById("integrationLogList");
  const internalApiList = document.getElementById("internalApiList"); // New list
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const exportBtn = document.getElementById("exportBtn");
  const statusText = document.getElementById("statusText");
  const resetBtn = document.getElementById("resetBtn");

  function renderList(element, items) {
    if (!element) return;
    element.innerHTML = "";
    // Ensure items is an array before trying to use forEach
    if(Array.isArray(items)){
      items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        element.appendChild(li);
      });
    }
  }

  function updateDisplay(data) {
    const uniqueScreens = new Set(data.logEntries || []);
    const uniqueIntegrations = new Set((data.integrationUrls || []).map(url => new URL(url).hostname));
    const internalApis = new Set(data.internalApiUrls || []);
    const queryCount = data.detectedQueries || 0;
    
    screenCountEl.textContent = uniqueScreens.size;
    integrationCountEl.textContent = uniqueIntegrations.size;
    queryCountEl.textContent = queryCount;
    tablesInput.value = data.tables || 0;
    
    renderList(screenLogList, [...uniqueScreens]);
    renderList(integrationLogList, [...uniqueIntegrations]);
    renderList(internalApiList, [...internalApis]); // Render new list
    
    updateTotal();
  }

  function updateTotal() {
    const screen = parseInt(screenCountEl.textContent) || 0;
    const integration = parseInt(integrationCountEl.textContent) || 0;
    const queries = parseInt(queryCountEl.textContent) || 0;
    const tables = parseInt(tablesInput.value) || 0;
    totalEl.textContent = screen + integration + queries + tables;
  }
  
  function updateInterface(isMonitoring) {
    startBtn.style.display = isMonitoring ? "none" : "block";
    stopBtn.style.display = isMonitoring ? "block" : "none";
    statusText.style.display = isMonitoring ? "flex" : "none";
    exportBtn.style.display = isMonitoring ? "none" : "block";
  }

  // --- Initial Load & Real-time Updates ---

  chrome.storage.local.get(null, (data) => {
    if (data) {
      updateDisplay(data);
      updateInterface(data.monitoring);
    }
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
      chrome.storage.local.get(null, (data) => {
        if (data) updateDisplay(data);
      });
    }
  });

  // --- Button Event Listeners ---
  
  tablesInput.addEventListener("input", () => {
    chrome.storage.local.set({ tables: parseInt(tablesInput.value) || 0 }, updateTotal);
  });

  startBtn.addEventListener("click", () => {
    const initialData = {
      monitoring: true,
      logEntries: [],
      integrationUrls: [],
      internalApiUrls: [], // Reset new list
      detectedQueries: 0,
      tables: 0
    };
    chrome.storage.local.set(initialData, () => {
      updateDisplay(initialData);
      updateInterface(true);
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { type: "ACTIVATE_MONITORING" });
        }
      });
    });
  });

  stopBtn.addEventListener("click", () => {
    chrome.storage.local.set({ monitoring: false }, () => {
      updateInterface(false);
    });
  });

  resetBtn.addEventListener("click", () => {
    chrome.storage.local.set({ monitoring: false }, () => {
      setTimeout(() => { chrome.runtime.reload(); }, 100);
    });
  });

  exportBtn.addEventListener("click", () => {
    chrome.storage.local.get(null, (data) => {
        const uniqueScreens = new Set(data.logEntries || []);
        const uniqueIntegrationDomains = new Set((data.integrationUrls || []).map(url => new URL(url).hostname));
        const internalApis = new Set(data.internalApiUrls || []);
        const queryCount = data.detectedQueries || 0;
        const tables = data.tables || 0;
        const total = uniqueScreens.size + uniqueIntegrationDomains.size + queryCount + tables;

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Category,Count\n";
        csvContent += `Screens (Unique),${uniqueScreens.size}\n`;
        csvContent += `Integrations (Unique Domains),${uniqueIntegrationDomains.size}\n`;
        csvContent += `Internal API Endpoints,${internalApis.size}\n`;
        csvContent += `GraphQL Queries,${queryCount}\n`;
        csvContent += `Tables (Manual),${tables}\n`;
        csvContent += `Total,${total}\n\n`;

        csvContent += "Category,Details\n";
        csvContent += "--- Visited Screens ---\n";
        [...uniqueScreens].forEach(url => { csvContent += `,${url.replace(/,/g, '')}\n`; });
        csvContent += "--- Integration Domains ---\n";
        [...uniqueIntegrationDomains].forEach(domain => { csvContent += `,${domain}\n`; });
        csvContent += "--- Internal API Endpoints ---\n";
        [...internalApis].forEach(path => { csvContent += `,${path}\n`; });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "ao-estimation-report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
  });
});