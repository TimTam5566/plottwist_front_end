/**
 * ============================================================
 * AUTHPROVIDER.JSX - Authentication State Management
 * ============================================================
 * 
 * WHAT THIS DOES:
 * Manages login state across your ENTIRE app using React Context.
 * Any component can access auth info without passing props down.
 * 
 * WHY CONTEXT?
 * Without Context, you'd have to pass auth props through every component:
 * App → NavBar → HomePage → ProjectCard → ... (prop drilling nightmare!)
 * 
 * With Context:
 * Any component can just call useAuth() to get auth data.
 * 
 * WHAT IT STORES:
 * - token: The auth token for API requests
 * - user_id: Current user's ID
 * - username: Current user's display name
 */

import { createContext, useState } from "react";

// ============================================================
// CREATE THE CONTEXT
// ============================================================
/**
 * createContext() creates a "container" that can hold data
 * and make it available to any child component.
 * 
 * Think of it like a global variable, but React-friendly.
 */

export const AuthContext = createContext();

// ============================================================
// THE PROVIDER COMPONENT
// ============================================================
/**
 * AuthProvider wraps your entire app (see main.jsx).
 * It provides the auth state to all children via Context.
 * 
 * props.children = everything inside <AuthProvider>...</AuthProvider>
 */

export const AuthProvider = (props) => {
    // ============================================================
    // AUTH STATE
    // ============================================================
    /**
     * useState initializes auth from localStorage.
     * This means if user refreshes the page, they stay logged in!
     * 
     * Initial state checks localStorage for existing login:
     * - If token exists → user was logged in before
     * - If null → user is not logged in
     */
    const [auth, setAuth] = useState({
        token: window.localStorage.getItem("token"),
        user_id: window.localStorage.getItem("user_id"),
        username: window.localStorage.getItem("username")
    });

    // ============================================================
    // LOGIN HANDLER
    // ============================================================
    /**
     * Called after successful login API response.
     * 
     * DOES TWO THINGS:
     * 1. Saves to localStorage (persists across page refreshes)
     * 2. Updates React state (triggers re-renders)
     * 
     * param token - Auth token from backend
     * param userId - User's ID
     * param username - User's display name
     */

    const handleLogin = (token, userId, username) => {
        // Save to localStorage (browser storage)
        window.localStorage.setItem("token", token);
        window.localStorage.setItem("user_id", userId);
        window.localStorage.setItem("username", username);
        // Update React state (triggers UI update)
        setAuth({
            token: token,
            user_id: userId,
            username: username
        });
    };

    // ============================================================
    // LOGOUT HANDLER
    // ============================================================
    /**
     * Called when user clicks "Log Out".
     * 
     * DOES TWO THINGS:
     * 1. Removes from localStorage (clears saved login)
     * 2. Sets state to null (triggers re-renders)
     * 
     * After this, auth.token will be null, so:
     * - NavBar shows Login/Signup buttons
     * - Protected actions are disabled
     * - API calls won't have auth headers
     */

    const handleLogout = () => {
        // Remove from localStorage
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user_id");
        window.localStorage.removeItem("username");
        // Update React state
        setAuth({
            token: null,
            user_id: null,
            username: null
        });
    };
    // ============================================================
    // PROVIDE TO CHILDREN
    // ============================================================
    /**
     * AuthContext.Provider makes these values available to any
     * child component that uses useAuth() hook.
     * 
     * value = what gets shared:
     * - auth: Current auth state { token, user_id, username }
     * - setAuth: Direct state setter (if needed)
     * - handleLogin: Login function
     * - handleLogout: Logout function
     */

    return (
        <AuthContext.Provider value={{ auth, setAuth, handleLogin, handleLogout }}>
            {props.children}
        </AuthContext.Provider>
    );
};
/**
 * USAGE IN OTHER COMPONENTS:
 * 
 * import { useAuth } from "../hooks/use-auth";
 * 
 * function SomeComponent() {
 *     const { auth, handleLogin, handleLogout } = useAuth();
 *     
 *     if (auth.token) {
 *         return <p>Welcome, {auth.username}!</p>;
 *     }
 *     return <p>Please log in</p>;
 * }
 */