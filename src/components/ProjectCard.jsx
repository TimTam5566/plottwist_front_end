import { Link } from "react-router-dom";
import { genreImages } from "../data/genreImages";

function ProjectCard({ project }) {
    // Return early if no project data
    if (!project) {
        return null;
    }

    // Get image based on genre or use default
    const imageUrl = project.genre && genreImages[project.genre]
        ? genreImages[project.genre]
        : "/images/default.jpeg";

    return (
        <div className="project-card">
            <Link to={`/project/${project.id}`}>
                <img
                    src={imageUrl || "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"}
                    alt={project.genre ? `${project.genre} project` : "Project"}
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
                <h3>{project.title || "Untitled Project"}</h3>
                <p>{project.description || "No description available"}</p>
            </Link>
        </div>
    );
}

export default ProjectCard;