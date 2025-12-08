/**
 * AuthProvider.jsx
 * 
 * This file defines the AuthProvider React component and AuthContext for managing authentication state in your app.
 * 
 * Function:
 * - Creates an AuthContext to share authentication data (token, user_id) and functions across the app.
 * - Uses React's useState to store the current authentication state, initialized from localStorage.
 * - Provides `handleLogin` to update auth state and localStorage when a user logs in.
 * - Provides `handleLogout` to clear auth state and localStorage when a user logs out.
 * - Wraps child components in AuthContext.Provider so they can access authentication data and functions.
 * 
 * Linked to:
 * - Used at the top level of your app (often in src/main.jsx or App.jsx) to provide authentication context to all components.
 * - Other components and hooks (e.g., login forms, protected routes, API calls) consume AuthContext to check auth status, log in, or log out.
 * - Ensures consistent authentication state and easy access to login/logout functionality throughout the app.
 */
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
    const [auth, setAuth] = useState({
        token: window.localStorage.getItem("token"),
        user_id: window.localStorage.getItem("user_id")
    });

    const handleLogin = (token, userId) => {
        window.localStorage.setItem("token", token);
        window.localStorage.setItem("user_id", userId);
        setAuth({
            token: token,
            user_id: userId
        });
    };

    const handleLogout = () => {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user_id");
        setAuth({
            token: null,
            user_id: null
        });
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, handleLogin, handleLogout }}>
            {props.children}
        </AuthContext.Provider>
    );
};