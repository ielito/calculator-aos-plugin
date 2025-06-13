console.log('AO Estimator: Main world interceptor script running.');

const originalFetch = window.fetch;

window.fetch = function(...args) {
  try {

    // 1. Get the URL and guarantee it's a string.
    // .toString() works on string, Request object, and URL object wohooo
    const url = args[0] ? args[0].toString() : '';

    // 2. Get the config object.
    const config = args[1] || {};

    // 3. Create a payload
    const safePayload = {
      url: url,
      options: {
        method: config.method || 'GET', // Default to GET if not specified (not sure if is it a best practices)
        body: null // Assume null unless we can safely get a string
      }
    };

    // This is the most common case for GraphQL. Ignore FormData, Blobs, etc. (To test)
    if (config.body && typeof config.body === 'string') {
      safePayload.options.body = config.body;
    }

    // 5. Send the sanitized, safe-to-clone payload.
    window.postMessage({
      type: 'AO_ESTIMATOR_FETCH',
      payload: safePayload
    }, '*');

  } catch (error) {
    console.error('AO Estimator: Error in fetch interceptor, but letting original fetch proceed.', error);
  }

  return originalFetch.apply(this, args);
};