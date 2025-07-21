// --- Robust Fetch Interceptor ---
// This script is injected into the main world of the web page to intercept API calls.
console.log('AO Estimator: Interceptor script loaded.');

const originalFetch = window.fetch;

window.fetch = async function(...args) {
  // Let the original fetch happen immediately, we'll analyze it in parallel
  const fetchPromise = originalFetch.apply(this, args);

  try {
    // 1. Resolve arguments to get URL and options
    let url;
    let options = {};
    if (args[0] instanceof Request) {
      url = args[0].url;
      options = {
        method: args[0].method,
        headers: new Headers(args[0].headers),
        body: await args[0].clone().text(), // Clone and read body
      };
      // Merge with any additional options
      Object.assign(options, args[1] || {});
    } else {
      url = new URL(args[0], window.location.href).href;
      options = args[1] || {};
    }

    const bodyString = options.body ? String(options.body) : null;

    // 3. Create a payload that is safe to be cloned and sent via postMessage
    const safePayload = {
      url: url,
      options: {
        method: options.method || 'GET',
        body: bodyString
      }
    };

    // 4. Send the sanitized payload to the content script
    window.postMessage({
      type: 'AO_ESTIMATOR_FETCH',
      payload: safePayload
    }, '*');

  } catch (error) {
    // Log errors but do not block the original fetch
    console.error('AO Estimator: Error in fetch interceptor.', error);
  }

  // Return the original fetch promise
  return fetchPromise;
};