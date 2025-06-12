document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["screenCount", "apiCount"], (data) => {
      const screen = data.screenCount || 0;
      const api = data.apiCount || 0;
      document.getElementById("screenCount").textContent = screen;
      document.getElementById("apiCount").textContent = api;
      document.getElementById("tables").addEventListener("input", updateTotal);
      updateTotal();
    });
  
    document.getElementById("copy").onclick = () => {
      const total = document.getElementById("total").textContent;
      const text = `Telas: ${screen}\nAPIs: ${api}\nTabelas: ${document.getElementById("tables").value}\nTotal: ${total} AOs`;
      navigator.clipboard.writeText(text);
    };
  });
  
  function updateTotal() {
    const screen = parseInt(document.getElementById("screenCount").textContent);
    const api = parseInt(document.getElementById("apiCount").textContent);
    const tables = parseInt(document.getElementById("tables").value);
    const total = screen + api + tables;
    document.getElementById("total").textContent = total;
  }