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