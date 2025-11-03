import { useParams, Link } from "react-router-dom";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import PledgeForm from "../components/PledgeForm";
import { useAuth } from "../hooks/use-auth";
import { API_URL } from "../config";
import { useProjectProgress } from "../hooks/use-project-progress";
import "./ProjectPage.css";

function ProjectPage() {
    const { auth } = useAuth();
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { calculateProgress, getContentLabel } = useProjectProgress();

    const getImageUrl = (image) => {
        if (!image) return "/images/default.jpg";
        if (image.startsWith('/media/')) {
            return `${API_URL}${image}`;
        }
        if (image.startsWith('http')) {
            return image.replace('/media/https://', 'https://');
        }
        return "/images/default.jpg";
    };

    // Debug logs with more info
    console.log("Current auth state:", {
        token: auth?.token,
        user_id: auth?.user_id,
        localStorage_token: window.localStorage.getItem("token"),
        localStorage_user_id: window.localStorage.getItem("user_id")
    });

    const isProjectOwner = useCallback(() => {
        const userId = window.localStorage.getItem("user_id");
        return parseInt(userId) === project?.owner;
    }, [project?.owner]);

    const imageUrl = useMemo(() => 
        project?.image ? getImageUrl(project.image) : "/images/default.jpg"
    , [project?.image]);

    const handlePledgeSuccess = useCallback(() => {
        if (auth?.token) {
            const headers = {
                "Authorization": `Token ${auth.token}`
            };

            fetch(`${import.meta.env.VITE_API_URL}/projects/${id}/`, { headers })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Error refreshing project: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    setProject(data);
                })
                .catch(err => {
                    console.error("Error refreshing project after pledge:", err);
                });
        }
    }, [auth?.token, id]);

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

    const calculatePledgeProgress = () => {
        if (!project?.pledges || !project?.goal) return 0;
        
        const totalPledges = project.pledges.reduce((sum, pledge) => 
            sum + (Number(pledge.amount) || 0), 0
        );
        
        return Math.min((totalPledges / project.goal) * 100, 100);
    };

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
                        src={imageUrl}
                        alt={project?.title}
                        className="project-image"
                        onError={(e) => {
                            e.target.src = "/images/default.jpg";
                        }}
                    />
                    <p><strong>Description:</strong> {project.description}</p>
                    <p><strong>Genre:</strong> {project.genre}</p>
                    <p><strong>Goal:</strong> {project.goal}</p>
                    <p><strong>Starting Content:</strong></p>
                    <pre>{project.starting_content}</pre>
                    <p><strong>Current Content:</strong></p>
                    <pre>{project.current_content}</pre>

                    <div className="progress-section">
                        <h4>Progress Tracker</h4>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ width: `${calculatePledgeProgress()}%` }}
                            />
                        </div>
                        <p className="progress-text">
                            Progress: {project.pledges?.length || 0} pledges
                            ({Math.round(calculatePledgeProgress())}% of goal)
                        </p>
                    </div>

                    <p><strong>Open for contributions:</strong> {project.is_open ? "Yes" : "No"}</p>
                    <p><strong>Date Created:</strong> {new Date(project.date_created).toLocaleString()}</p>
                    <PledgeForm 
                        projectId={project?.id} 
                        project={project}
                        onSuccess={handlePledgeSuccess}
                    />
                </>
            )}
        </div>
    );
}

export default ProjectPage;