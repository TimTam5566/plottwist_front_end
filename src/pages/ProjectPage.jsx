import { useParams, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import PledgeForm from "../components/PledgeForm";
import { useAuth } from "../hooks/use-auth";

function ProjectPage() {
    const { auth } = useAuth();
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Debug logs with more info
    console.log("Current auth state:", {
        token: auth?.token,
        user_id: auth?.user_id,
        localStorage_token: window.localStorage.getItem("token"),
        localStorage_user_id: window.localStorage.getItem("user_id")
    });

    const isProjectOwner = () => {
        const userId = window.localStorage.getItem("user_id");
        console.log("Checking ownership:", {
            storedUserId: userId,
            authUserId: auth?.user_id,
            projectOwner: project?.owner,
            isOwner: parseInt(userId) === project?.owner
        });
        return parseInt(userId) === project?.owner;
    };

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Only add Authorization header if token exists
        const headers = {};
        if (auth?.token) {
            headers["Authorization"] = `Token ${auth.token}`;
        }

        fetch(`${import.meta.env.VITE_API_URL}/projects/${id}/`, { headers })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Error fetching project: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("Project data received:", data);
                setProject(data);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [id, auth?.token]);

    return (
        <div className="page-wrap">
            <h2>Project Details</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {project && !error && (
                <>
                    <div className="project-header">
                        <h3>{project.title}</h3>
                        {isProjectOwner() && (
                            <Link to={`/project/${project.id}/edit`} className="edit-button">
                                Edit Project
                            </Link>
                        )}
                    </div>
                    <img
                        src={project.image || "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"}
                        alt={project.title}
                        className="project-image"
                        onError={e => {
                            if (!e.target.dataset.fallback) {
                                e.target.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
                                e.target.dataset.fallback = "true";
                            } else {
                                e.target.onerror = null;
                                e.target.src = "";
                            }
                        }}
                    />
                    <p><strong>Description:</strong> {project.description}</p>
                    <p><strong>Genre:</strong> {project.genre}</p>
                    <p><strong>Goal:</strong> {project.goal}</p>
                    <p><strong>Starting Content:</strong></p>
                    <pre>{project.starting_content}</pre>
                    <p><strong>Current Content:</strong></p>
                    <pre>{project.current_content}</pre>
                    <p><strong>Open for contributions:</strong> {project.is_open ? "Yes" : "No"}</p>
                    <p><strong>Date Created:</strong> {new Date(project.date_created).toLocaleString()}</p>
                    <PledgeForm projectId={project.id} />
                </>
            )}
        </div>
    );
}

export default ProjectPage;