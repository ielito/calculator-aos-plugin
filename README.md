# AO Estimator – Chrome Extension

This Chrome extension helps estimate the number of Application Objects (AOs) used in a web application, especially useful when evaluating OutSystems-based architectures or sizing similar apps.

---

## 🚀 Features

- ✅ Counts **screen/page views** while navigating
- ✅ Detects **external API calls**
- ✅ Allows **manual entry** of database table usage
- ✅ Generates a **total AO estimation**
- ✅ Displays a **log of visited URLs**
- ✅ Supports **CSV export** for reporting

---

## 🧩 How it Works

1. Click **Start** on the extension popup.
2. Navigate your app normally — screens and APIs are counted.
3. Click **Stop** when finished.
4. Click **Export CSV** to generate a downloadable AO usage report.

---

## 📦 Installation

1. Clone or download this repository.
2. Open `chrome://extensions/` in your browser.
3. Enable **Developer Mode**.
4. Click **Load unpacked** and select the project folder.

---

## 📁 File Structure

| File             | Description |
|------------------|-------------|
| `manifest.json`  | Chrome extension configuration |
| `popup.html`     | User interface |
| `popup.js`       | UI logic and state control |
| `content.js`     | Monitors navigation and API usage |
| `background.js`  | Reserved for future enhancements |
| `icon.png`       | Plugin icon |
| `README.md`      | This documentation |

---

## 📊 How AO is Estimated

```
Total AOs = Number of Screens + Number of API Calls + Number of Tables
```

---

## ✅ Example Output (CSV)

```
Type,Value
Screens,5
APIs,3
Tables,7
Total,15

Log of URLs
,/home
,/dashboard
,/settings
```

---

## 🔒 Permissions

This extension uses:
- `storage` to save temporary AO data
- `activeTab` to monitor navigation
- `scripting` to inject logic for XHR/API tracking

---

## 📝 License

MIT License

---

Built with ❤️ for developer and pre-sales use.