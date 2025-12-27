/**
 * ============================================================
 * USE-AUTH.JS - Authentication Hook
 * ============================================================
 * 
 * WHAT THIS DOES:
 * A simple hook that provides access to the AuthContext.
 * 
 * WHY A CUSTOM HOOK?
 * Instead of importing both useContext AND AuthContext everywhere:
 *   import { useContext } from "react";
 *   import { AuthContext } from "../components/AuthProvider";
 *   const auth = useContext(AuthContext);
 * 
 * You just do:
 *   import { useAuth } from "../hooks/use-auth";
 *   const { auth, handleLogin, handleLogout } = useAuth();
 * 
 * Cleaner and more reusable!
 */

// 1. React imports first
import { useContext } from "react";

// 2. Configuration imports
import { API_URL } from "../config";

// 3. Local component/context imports
import { AuthContext } from "../components/AuthProvider";

export const useAuth = () => {
    // useContext retrieves the current value from AuthContext
    // Returns: { auth, setAuth, handleLogin, handleLogout }
    // We pass in the context and create a custom hook that returns the context auth and setAuth
    return useContext(AuthContext);
};

/**
 * USAGE EXAMPLE:
 * 
 * function MyComponent() {
 *     const { auth, handleLogout } = useAuth();
 *     
 *     return (
 *         <div>
 *             {auth.token ? (
 *                 <>
 *                     <p>Welcome, {auth.username}!</p>
 *                     <button onClick={handleLogout}>Log Out</button>
 *                 </>
 *             ) : (
 *                 <p>Please log in</p>
 *             )}
 *         </div>
 *     );
 * }
 */