/**
 * post-signup.js
 * 
 * This file provides an async function to register a new user via the backend API.
 * 
 * Function:
 * - `postSignup({ username, password, email, first_name, last_name })`:
 *    - Sends a POST request to the `/users/` endpoint with the provided user details.
 *    - Formats the request as JSON and includes all required fields for user registration.
 *    - Handles errors by parsing the server response and throwing a detailed error message if signup fails.
 *    - Returns the parsed JSON response containing the new user's data on success.
 * 
 * Linked to:
 * - Used by signup forms/components (e.g., `SignupForm.jsx`).
 * - Allows new users to register from the frontend.
 * - Ensures proper error handling and feedback for user registration.
 */
async function postSignup({ username, password, email, first_name, last_name }) {
    // Update the endpoint below to match your backend's actual signup endpoint!
    const url = `${import.meta.env.VITE_API_URL}/users/`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, email, first_name, last_name }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Failed to sign up");
        }

        return data;
    } catch (err) {
        console.error("Signup error:", err);
        throw err;
    }
}

export default postSignup;