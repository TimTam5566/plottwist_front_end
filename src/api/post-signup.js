/**
 * ============================================================
 * POST-SIGNUP.JS - Register New User
 * ============================================================
 * 
 * WHAT THIS DOES:
 * Creates a new user account in the database.
 * 
 * WHEN IT'S USED:
 * - SignupPage form submission
 * 
 * API ENDPOINT: POST /users/
 * AUTHENTICATION: Not required (creating new account)
 * 
 * PARAMETERS:
 * - username, password, email, first_name, last_name
 */
async function postSignup({ username, password, email, first_name, last_name }) {
    
    const url = `${import.meta.env.VITE_API_URL}/users/`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                username, 
                password,  // Backend will hash this!
                email, 
                first_name, 
                last_name 
            }),
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

/**
 * AFTER SIGNUP SUCCESS:
 * 
 * User is created but NOT logged in.
 * The calling code typically redirects to /login
 * so user can authenticate and get their token.
 */