import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

function LoginForm() {
    const navigate = useNavigate();
    const { auth, setAuth } = useAuth();
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
        setError("");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api-token-auth/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.non_field_errors?.[0] || "Login failed");
            }

            window.localStorage.setItem("token", data.token);
            setAuth({ token: data.token });
            navigate("/");

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <button type="submit">Login</button>
        </form>
    );
}

export default LoginForm;
