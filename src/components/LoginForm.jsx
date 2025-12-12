/**
 * LoginForm.jsx - Literary Theme
 * 
 * Login form that saves username to auth context
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import "./LoginForm.css";

function LoginForm() {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api-token-auth/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Pass username along with token and user_id
                handleLogin(data.token, data.user_id, formData.username);
                navigate("/");
            } else {
                setError("We knocked, but the castle gates stayed shut. Check your spellbook (or your password).");
            }
        } catch (err) {
            setError("A mysterious force blocked our path. Please try again later.");
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h1>Continue Your Story</h1>
            <p className="lead">Welcome back, dear author.</p>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-field">
                <label htmlFor="username">Pen Name</label>
                <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Your pen name"
                    required
                />
            </div>
            <div className="form-field">
                <label htmlFor="password">Secret Word</label>
                <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Your secret word"
                    required
                />
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn--primary">Enter the Library</button>
                <button type="button" className="btn btn--ghost" onClick={() => navigate('/signup')}>
                    New here? Begin your story
                </button>
            </div>
            
            <p className="tagline">Every great story deserves a next chapter</p>
        </form>
    );
}

export default LoginForm;
