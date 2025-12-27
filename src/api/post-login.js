/**
 * ============================================================
 * POST-LOGIN.JS - Authenticate User
 * ============================================================
 * 
 * WHAT THIS DOES:
 * Sends username/password to backend and receives an auth token.
 * 
 * WHEN IT'S USED:
 * - LoginPage form submission
 * 
 * API ENDPOINT: POST /api-token-auth/
 * AUTHENTICATION: Not required (this IS the authentication!)
 * 
 * PARAMETERS:
 * - username: User's username
 * - password: User's password
 * 
 * RETURNS:
 * {
 *   "token": "abc123...",
 *   "user_id": 1,
 *   "email": "user@examp.com"
 * }
 */


async function postLogin(username, password) {
    const url = `${import.meta.env.VITE_API_URL}/api-token-auth/`;
    // Import helper (could also be at top of file)
    const { withAuthHeaders } = await import('./_helpers.js');
    const headers = withAuthHeaders({ 'Content-Type': 'application/json' });
    // Send login request
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
        "username": username,
        "password": password,
        }),
    });
    // Handle errors
    if (!response.ok) {
        const fallbackError = `Error trying to login`;

        const data = await response.json().catch(() => {
        throw new Error(fallbackError);
        });

        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }
    // Return token and user info
    return await response.json();
}

export default postLogin;
/**
 * AFTER LOGIN SUCCESS:
 * 
 * The calling code (AuthProvider) typically does:
 * 
 * const data = await postLogin(username, password);
 * localStorage.setItem("token", data.token);
 * localStorage.setItem("userId", data.user_id);
 * 
 * Now all future API calls can include the token!
 */