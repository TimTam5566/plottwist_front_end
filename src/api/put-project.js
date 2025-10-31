async function putProject(projectId, updatedData) {
    const url = `${import.meta.env.VITE_API_URL}/projects/${projectId}/`;
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        },
        body: JSON.stringify(updatedData)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update project");
    }
    return await response.json();
}
export default putProject;