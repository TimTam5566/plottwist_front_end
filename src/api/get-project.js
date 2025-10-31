async function getProject(projectId) {
    const url = `${import.meta.env.VITE_API_URL}/projects/${projectId}`;
    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
        const fallbackError = `Error fetching project with id ${projectId}`;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json().catch(() => {
                throw new Error(fallbackError);
            });
            const errorMessage = data?.detail ?? fallbackError;
            throw new Error(errorMessage);
        } else {
            throw new Error(fallbackError);
        }
    }

    return await response.json();
}

export default getProject;