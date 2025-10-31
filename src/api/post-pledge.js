async function postPledge(projectId, payload) {
    const url = `${import.meta.env.VITE_API_URL}/projects/${projectId}/pledges/`; // <-- FIXED ENDPOINT
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
    };
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        throw new Error(`Error creating pledge (status ${response.status} ${response.statusText})`);
    }
    return await response.json();
}
export default postPledge;

