// src/api/post-project.js
async function postProject(projectData) {
const url = `${import.meta.env.VITE_API_URL}/projects/`;
const token = window.localStorage.getItem("token");

const apiData = {
    title: projectData.title,
    description: projectData.description,
    goal: parseFloat(projectData.goal),
    genre: projectData.genre,
    starting_content:projectData.startingVerseParagraph,
    image: projectData.image,
    is_open: projectData.is_open ?? true, // default true if missing
    is_active: projectData.is_active ?? true,
};

const response = await fetch(url, {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    ...(token && {
        Authorization: token.startsWith("Token") ? token : `Token ${token}`,
    }),
    },
    body: JSON.stringify(apiData),
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