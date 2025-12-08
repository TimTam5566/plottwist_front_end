// Adds and authorisation header to any headers object uyou pass, used to ensure API requests 
// include the correct authentication for the endpoints that require it. If no token is found
// it returns the headers object unchanged. Heasders are essential for API's to understand 
// how to process requests and responses 


export function withAuthHeaders(headers = {}) {
    const token = localStorage.getItem("token");
    return token
        ? { ...headers, Authorization: `Token ${token}` } // <-- Change 'Bearer' to 'Token'
        : headers;
}