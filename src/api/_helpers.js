/**
 * ============================================================
 * _HELPERS.JS - Utility Functions for API Calls
 * ============================================================
 * 
 * WHAT THIS DOES:
 * Provides a helper function to add authentication headers to API requests.
 * 
 * WHY IT'S USEFUL:
 * Instead of writing this in every API file:
 *   const token = localStorage.getItem("token");
 *   headers: { Authorization: `Token ${token}` }
 * 
 * You can just do:
 *   headers: withAuthHeaders({ 'Content-Type': 'application/json' })
 */


export function withAuthHeaders(headers = {}) {
    // Get the auth token from browser's localStorage
    const token = localStorage.getItem("token");

    // If token exists, add Authorization header
    // If not, return headers unchanged
    return token
        ? { ...headers, Authorization: `Token ${token}` } // <-- Change 'Bearer' to 'Token'
        : headers;
}

/**
 * EXAMPLE USAGE:
 * 
 * // Without helper:
 * const token = localStorage.getItem("token");
 * fetch(url, {
 *   headers: {
 *     'Content-Type': 'application/json',
 *     Authorization: `Token ${token}`
 *   }
 * });
 * 
 * // With helper:
 * fetch(url, {
 *   headers: withAuthHeaders({ 'Content-Type': 'application/json' })
 * });
 * 
 * SPREAD OPERATOR (...):
 * { ...headers } creates a copy of headers object
 * Then we add Authorization to it
 * 
 * Result: { 'Content-Type': 'application/json', Authorization: 'Token abc123' }
 */