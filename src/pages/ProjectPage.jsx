import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import PledgeForm from "../components/PledgeForm";

function ProjectPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`https://plot-twist-you-are-the-author-fdc848555cc9.herokuapp.com/projects/${id}/`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Error fetching project: ${res.status}`);
                }
                return res.json();
            })
            .then(data => setProject(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div>
            <h2>Project Details</h2>
            <p>Project ID: {id}</p>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {project && !error && (
                <>
                    <h3>{project.title}</h3>
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