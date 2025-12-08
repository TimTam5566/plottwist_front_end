// provides an async function to fetch a single project's data from Backend API

// async function takes a projecid as input, builds the API url, sends a GET request to fetch project data
async function getProject(projectId) {
    const url = `${import.meta.env.VITE_API_URL}/projects/${projectId}`;
    const response = await fetch(url, { method: "GET" });
// If the response is not ok, it checks if the response is JSON, if JSON it tries to extracrt
// a detailed error message. Otherwise, it throws a generic error.
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
// If the response is ok, it returns the parsed JSON data.
    return await response.json();
}
// exports the getProject function as the default export of the module
export default getProject;