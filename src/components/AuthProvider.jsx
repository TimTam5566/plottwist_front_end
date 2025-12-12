/**
 * AuthProvider.jsx
 * 
 * Provides authentication context for the entire app.
 * Now includes username storage.
 */

import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
    const [auth, setAuth] = useState({
        token: window.localStorage.getItem("token"),
        user_id: window.localStorage.getItem("user_id"),
        username: window.localStorage.getItem("username")
    });

    const handleLogin = (token, userId, username) => {
        window.localStorage.setItem("token", token);
        window.localStorage.setItem("user_id", userId);
        window.localStorage.setItem("username", username);
        setAuth({
            token: token,
            user_id: userId,
            username: username
        });
    };

    const handleLogout = () => {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user_id");
        window.localStorage.removeItem("username");
        setAuth({
            token: null,
            user_id: null,
            username: null
        });
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, handleLogin, handleLogout }}>
            {props.children}
        </AuthContext.Provider>
    );
};
