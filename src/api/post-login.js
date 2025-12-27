/**
 * postLogin.js
 * 
 * This file provides an async function to handle user login via the backend API.
 * 
 * Function:
 * - `postLogin(username, password)`: 
 *    - Sends a POST request to the `/api-token-auth/` endpoint with the provided username and password.
 *    - Uses the `withAuthHeaders` helper to include authentication headers if available.
 *    - Handles errors by parsing the response and throwing a detailed error message if login fails.
 *    - Returns the parsed JSON response containing authentication data (such as token) on success.
 * 
 * Linked to:
 * - Used by login forms or authentication logic in your frontend (e.g., LoginPage, AuthProvider).
 * - Allows your app to authenticate users and receive a token for subsequent authenticated API requests.
 */
/**
 * ============================================================
 * POST-LOGIN.JS - User Login API Function
 * ============================================================
 * 
 * Authenticates a user and returns a token.
 * 
 * USED BY: LoginForm.jsx (or could be wrapped in a hook)
 */

import { API_URL } from "../config";

async function postLogin(username, password) {
    const url = `${API_URL}/api-token-auth/`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    });

    if (!response.ok) {
        const fallbackError = "Error trying to login";

        const data = await response.json().catch(() => {
            throw new Error(fallbackError);
        });

        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}

export default postLogin;