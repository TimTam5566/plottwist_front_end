/**
 * CreateProjectPage.jsx - Literary Theme
 * 
 * Page wrapper for the ProjectForm component
 * Redirects to login if not authenticated
 */

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import "./CreateProjectPage.css";
import ProjectForm from "../components/ProjectForm";

function CreateProjectPage() {
    const { auth } = useAuth();
    const pageRef = useRef(null);

    // Scroll to top when page loads - multiple attempts
    useEffect(() => {
        // Immediate scroll
        window.scrollTo(0, 0);
        
        // Delayed scroll (in case content loads after)
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
            if (pageRef.current) {
                pageRef.current.scrollIntoView({ behavior: 'instant' });
            }
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    // If not logged in, show login prompt
    if (!auth?.token) {
        return (
            <div className="create-project-page" ref={pageRef}>
                <div className="page-wrap">
                    <div className="login-required-card">
                        <span className="card-icon">🔐</span>
                        <h2>A Key is Required</h2>
                        <p>Only registered authors may begin a new tale.</p>
                        <p className="subtitle">Please sign in to unlock your quill.</p>
                        <div className="card-actions">
                            <Link to="/login" className="btn btn--primary">
                                Enter the Library
                            </Link>
                            <Link to="/signup" className="btn btn--secondary">
                                Become an Author
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If logged in, show the form
    return (
        <div className="create-project-page" ref={pageRef}>
            <div className="page-wrap">
                <ProjectForm />
            </div>
        </div>
    );
}

export default CreateProjectPage;
