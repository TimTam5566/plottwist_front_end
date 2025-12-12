/**
 * LoginPage.jsx
 * 
 * Wrapper for LoginForm with scroll to top
 */

import { useLayoutEffect } from "react";
import LoginForm from "../components/LoginForm";

function LoginPage() {
    // Scroll to top BEFORE paint using useLayoutEffect
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, []);

    return <LoginForm />;
}

export default LoginPage;
