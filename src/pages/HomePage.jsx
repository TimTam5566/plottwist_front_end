import useProjects from "../hooks/use-projects";
import ProjectCard from "../components/ProjectCard";
import "./HomePage.css";
import { useState } from "react";

function HomePage() {
    const { projects, isLoading, error, refetch } = useProjects();
    const [projectsState, setProjectsState] = useState([]);

    if (isLoading) {
        return (
            <div className="page-wrap">
                <h1>Welcome to Plot Twist!</h1>
                <div className="muted">Loading projects…</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-wrap">
                <h1>Welcome to Plot Twist!</h1>
                <div role="alert">
                    <p className="muted">Error loading projects: {error.message}</p>
                    <button onClick={refetch} disabled={isLoading}>
                        {isLoading ? "Retrying…" : "Retry"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrap">
            <h1>Welcome to Plot Twist!</h1>
            <div className="project-list">
                {projects && projects.length > 0 ? (
                    projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                ) : (
                    <p>No projects available</p>
                )}
            </div>
        </div>
    );
}

export default HomePage;
