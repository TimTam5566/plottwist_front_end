/**
 * ProtectedRoute.jsx
 *
 * Wraps routes that require authentication.
 * Redirects to /login if the user is not logged in.
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

function ProtectedRoute({ children }) {
    const { auth } = useAuth();

    if (!auth?.token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
