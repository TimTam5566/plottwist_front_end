/**
 * ============================================================
 * GET-PROJECTS.JS - Fetch All Projects from API
 * ============================================================
 * DESCRIPTION:
 * Fetches the list of ALL projects from the backend.
 * 
 * WHEN IT'S USED:
 * - HomePage to display project cards
 * - Any page showing a list of projects
 * 
 * API ENDPOINT: GET /projects/
 * AUTHENTICATION: Not required (public endpoint)
 */


async function getProjects() {
    // First we create the URL for the request by using the Vite environment variable and the API endpoint.
    // Build the API URL using environment variable
    // Example: "https://your-api.herokuapp.com/projects"
    const url = `${import.meta.env.VITE_API_URL}/projects`;

    // Next we call the fetch function and pass in the url and the method. The method is set 
    // to `GET` because we are fetching data. Fetch returns a "promise".
    // If the promise "resolves" (i.e., if the back end responds) we will 
    // get the data we need in the `response` variable. If the back end fails to respond then we'll get an error.
    const response = await fetch(url, { method: "GET" });

    // We can use the `ok` property on `response` to check if the request was successful.
    // If the request was not successful then we will throw an error...
    // Check if request was successful (status 200-299)
    if (!response.ok) {
        // Fun themed error message for your storytelling app!
        const fallbackError = 
            "the page turned, but the ink did not follow" + 
            "No pledges appear, though we called them by name. " +
            "Perhaps they are wandering — lost in the margins, " +
            "or caught between commas in the cloud. Try again soon, " +
            "or refresh the tale. Every story waits to be found.";

        // Try to get error details from response body
        const data = await response.json().catch(() => {
            // If response isn't JSON, throw generic error
            throw new Error(fallbackError);
        });

        // Use server's error message if available, otherwise fallback
        const errorMessage = data?.detail ?? fallbackError;
        throw new Error(errorMessage);
    }

    // Success! Parse and return the JSON data
    // This will be an array of project objects
    return await response.json();
}

export default getProjects;
/**
 * EXAMPLE RESPONSE:
 * [
 *   {
 *     "id": 1,
 *     "title": "The Haunted Lighthouse",
 *     "description": "A spooky collaborative tale...",
 *     "image": "https://res.cloudinary.com/...",
 *     "owner": 1,
 *     "is_open": true,
 *     ...
 *   },
 *   {
 *     "id": 2,
 *     "title": "Space Adventure",
 *     ...
 *   }
 * ]
 */
