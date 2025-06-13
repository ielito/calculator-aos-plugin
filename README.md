# AO Estimator - Chrome Extension

A Chrome extension to assist in estimating Application Object (AO) counts for modern web applications. It works by tracking user navigation, API usage, and other key metrics to provide a data-driven baseline for sizing application complexity.

This tool is ideal for pre-sales engineers, architects, and developers who need to quickly gauge the scale of a web application built on any technology (Java, .NET, Node.js, etc.) by observing its frontend behavior.

## ✨ Key Features

-   ✅ **Unique Screen Tracking**: Counts each unique page and URL state change as a distinct screen.
-   🔎 **Internal API Discovery**: Logs all internal API endpoints the application calls, serving as a powerful proxy for database table estimation.
-   🌐 **External Integration Detection**: Identifies all external domains the application communicates with via APIs.
-   ⚡ **GraphQL Query Counting**: Detects and counts GraphQL operations within API calls.
-   📝 **Manual Table Input**: Allows for manual entry of estimated database tables, informed by the discovered internal APIs.
-   📄 **CSV Export**: Exports all captured data into a clean CSV report for analysis and sharing.
-   🎨 **Professional UI**: Features a clean, OutSystems-themed interface for a polished user experience.

## 🚀 How It Works

The workflow is designed to be simple for the end-user (e.g., your client):

1.  **Install** the extension in developer mode.
2.  Navigate to the target web application.
3.  Click the extension icon in the Chrome toolbar and press **Start**.
4.  Use the web application normally, navigating through its various features.
5.  When finished, click **Stop** in the extension popup.
6.  Review the captured metrics and use the **Export CSV** button to download the report.

## 📊 Estimation Methodology

The tool captures frontend metrics that serve as proxies for backend complexity, aligning with concepts like OutSystems Application Objects (AOs).

* **Screens (Unique)**: Represents the application's UI/View layer complexity.
* **Integrations (Unique)**: Represents dependencies on external systems.
* **Internal API Endpoints**: This is the key data for estimating data model complexity. The list of endpoints (e.g., `/api/users`, `/api/orders`) provides strong hints about the underlying database tables.
* **GraphQL Queries**: Directly counts data-centric operations.
* **Tables (Estimated)**: This is a **manual input** where the analyst uses the `Internal API Endpoints` list to make an educated guess on the number of core data entities.

The final count is a sum of these metrics, providing a comprehensive high-level estimate of the application's size.

## 📦 Installation

1.  Clone or download this repository as a ZIP file and unzip it.
2.  Open Google Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer Mode** using the toggle in the top-right corner.
4.  Click **Load unpacked** and select the unzipped project folder.
5.  The AO Estimator icon will appear in your Chrome toolbar.

## 🛠️ Technical Overview

This extension uses a robust architecture to reliably capture data from modern web applications (SPAs).

* **Screen Tracking**: Uses the `chrome.webNavigation` API to listen for history state changes, accurately capturing navigations in React, Angular, Vue, etc.
* **API Interception**: To overcome Manifest V3's "Isolated Worlds" security feature, the extension injects a lightweight `interceptor.js` script into the page's main execution context. This script safely wraps the `window.fetch` API, sending sanitized data back to the extension's content script for analysis. This ensures that all API calls made by the application are captured without breaking the page's functionality.

### File Structure

| File                  | Description                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| `manifest.json`       | Configures the extension, its permissions, and scripts.                                                 |
| `popup.html` / `style.css` | The extension's user interface and OutSystems-themed styling.                                     |
| `popup.js`            | Handles the UI logic, state control (Start/Stop), and real-time display of captured data.               |
| `background.js`       | Listens for unique screen navigations using the `chrome.webNavigation` API.                             |
| `content.js`          | Injected into the web page. Manages the injection of the interceptor and processes data received from it. |
| `interceptor.js`      | The lightweight script injected into the page's "main world" to wrap the `fetch` API and capture calls. |
| `icon16/32/48/128.png` | The extension icons for the toolbar and extension page.                                                 |

### 🔒 Permissions

* `storage`: To save captured data and the recording state.
* `webNavigation`: To detect screen changes in SPAs.
* `tabs`: To allow the popup to communicate with the active tab (e.g., to start the API interceptors).

---

MIT License