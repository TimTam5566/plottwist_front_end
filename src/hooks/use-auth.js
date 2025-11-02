// 1. React imports first
import { useContext } from "react";

// 2. Configuration imports
import { API_URL } from "../config";

// 3. Local component/context imports
import { AuthContext } from "../components/AuthProvider";

export const useAuth = () => {
    // We pass in the context and create a custom hook that returns the context auth and setAuth
    return useContext(AuthContext);
};