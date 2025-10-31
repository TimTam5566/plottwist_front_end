// src/api/post-signup.js
// src/api/post-signup.js
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