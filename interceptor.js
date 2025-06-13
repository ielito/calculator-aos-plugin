// interceptor.js - Final Paranoid Version

console.log('AO Estimator: Main world interceptor script running.');

// We must wrap the original fetch in a try...catch block.
// If our logic fails, we MUST call the original fetch to not break the page.
const originalFetch = window.fetch;

window.fetch = function(...args) {
  try {
    // --- Data Sanitization: Be extremely careful and defensive ---

    // 1. Get the URL and guarantee it's a string.
    // .toString() works on string, Request object, and URL object.
    const url = args[0] ? args[0].toString() : '';

    // 2. Get the config object.
    const config = args[1] || {};

    // 3. Create a payload that is guaranteed to be cloneable.
    const safePayload = {
      url: url,
      options: {
        method: config.method || 'GET', // Default to GET if not specified
        body: null // Assume null unless we can safely get a string
      }
    };

    // 4. Safely extract the body ONLY if it's a string.
    // This is the most common case for GraphQL. Ignore FormData, Blobs, etc.
    if (config.body && typeof config.body === 'string') {
      safePayload.options.body = config.body;
    }

    // 5. Send the sanitized, safe-to-clone payload.
    window.postMessage({
      type: 'AO_ESTIMATOR_FETCH',
      payload: safePayload
    }, '*');

  } catch (error) {
    // If our interception logic has ANY error, log it, but DO NOT stop the original fetch.
    console.error('AO Estimator: Error in fetch interceptor, but letting original fetch proceed.', error);
  }

  // --- Crucially, always call the original fetch ---
  return originalFetch.apply(this, args);
};