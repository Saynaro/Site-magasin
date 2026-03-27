export const API_URL =
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? `http://${window.location.hostname}:3000`
        : 'https://magasinproject.onrender.com');

/**
 * Helper to make API calls automatically attaching credentials (cookies).
 * Handles JSON parsing and error throwing on bad status.
 */
export async function fetchAPI(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;

    // Merge provided options with mandatory credentials
    const fetchOptions = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        credentials: 'include' // THIS IS VITAL FOR COOKIES
    };

    // If body is an object and not FormData, stringify it
    if (fetchOptions.body && typeof fetchOptions.body === 'object' && !(fetchOptions.body instanceof FormData)) {
        fetchOptions.body = JSON.stringify(fetchOptions.body);
    }

    const response = await fetch(url, fetchOptions);

    let data;
    try {
        data = await response.json();
    } catch (e) {
        data = null;
    }

    if (!response.ok) {
        throw new Error(data?.error || data?.message || `HTTP error! status: ${response.status}`);
    }

    return data;
}