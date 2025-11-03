// src/api/post-project.js
async function postProject(projectData) {
    const url = `${import.meta.env.VITE_API_URL}/projects/`;
    const token = window.localStorage.getItem("token");

    // Create FormData object
    const formData = new FormData();
    formData.append("title", projectData.title);
    formData.append("description", projectData.description);
    formData.append("goal", parseFloat(projectData.goal));
    formData.append("genre", projectData.genre);
    formData.append("starting_content", projectData.startingVerseParagraph || "");
    formData.append("owner", parseInt(projectData.owner)); // Ensure owner is an integer
    formData.append("is_open", projectData.is_open ?? true);
    formData.append("is_active", projectData.is_active ?? true);

    if (projectData.image) {
        formData.append("image", projectData.image);
    }

    // Debug log
    console.log("FormData entries:", [...formData.entries()]);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            ...(token && {
                Authorization: token.startsWith("Token") ? token : `Token ${token}`,
            }),
        },
        body: formData,
    });

    // Log for debugging during development
    console.log("API Response status:", response.status);
    console.log("API Response ok:", response.ok);

    // Error handling
    if (!response.ok) {
        const fallbackError = `HTTP ${response.status}: Error creating project`;

        try {
            const responseText = await response.text();
            console.log("Server error response:", responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch {
                const error = new Error(responseText || fallbackError);
                error.response = {
                    status: response.status,
                    statusText: response.statusText,
                    data: { detail: responseText },
                };
                throw error;
            }

            const error = new Error(data?.detail || fallbackError);
            error.response = {
                status: response.status,
                statusText: response.statusText,
                data: data,
            };
            throw error;
        } catch (networkError) {
            const error = new Error(fallbackError);
            error.response = {
                status: response.status,
                statusText: response.statusText,
                data: null,
            };
            throw error;
        }
    }

    return await response.json();
}

export default postProject;