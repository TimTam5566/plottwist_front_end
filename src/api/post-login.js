async function postLogin(username, password) {
    const url = `${import.meta.env.VITE_API_URL}/api-token-auth/`;
    const { withAuthHeaders } = await import('./_helpers.js');
    const headers = withAuthHeaders({ 'Content-Type': 'application/json' });
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
        "username": username,
        "password": password,
        }),
    });

    if (!response.ok) {
        const fallbackError = `Error trying to login`;

        const data = await response.json().catch(() => {
        throw new Error(fallbackError);
        });

        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    return await response.json();
}

export default postLogin;