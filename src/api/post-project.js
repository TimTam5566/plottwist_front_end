import { useAuth } from "../hooks/use-auth";

async function postProject(projectData, authToken, userId) {
    const url = `${import.meta.env.VITE_API_URL}/projects/`;
    
    if (!authToken || !userId) {
        throw new Error('Authentication required');
    }

    const ownerId = Number(userId);
    
    if (isNaN(ownerId)) {
        throw new Error('Invalid user ID format');
    }

    const formData = new FormData();
    formData.append("title", projectData.title);
    formData.append("description", projectData.description);
    formData.append("goal", projectData.goal);
    formData.append("genre", projectData.genre);
    formData.append("owner", ownerId);
    formData.append("starting_content", projectData.startingVerseParagraph || "");
    formData.append("is_open", true);

    if (projectData.image) {
        formData.append("image", projectData.image);
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Token ${authToken}`,
        },
        body: formData,
    });

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