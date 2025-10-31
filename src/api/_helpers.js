export function withAuthHeaders(headers = {}) {
    const token = localStorage.getItem("token");
    return token
        ? { ...headers, Authorization: `Token ${token}` } // <-- Change 'Bearer' to 'Token'
        : headers;
}