import { Link } from "react-router-dom";
import { useState } from "react"; // Add this import
import { getGenreImage } from "../data/genreImages";

function ProjectCard({ project }) {
    const [imgError, setImgError] = useState(false);
    const imageUrl = imgError ? "/images/default.jpg" : getGenreImage(project.genre);

    return (
        <div className="project-card">
            <Link to={`/project/${project.id}`}>
                <img
                    src={imageUrl}
                    alt={`${project.genre} project`}
                    onError={(e) => {
                        console.error(`Failed to load image: ${e.target.src}`);
                        setImgError(true);
                    }}
                    className="project-image"
                />
                <h3>{project.title || "Untitled Project"}</h3>
                <p>{project.description || "No description available"}</p>
            </Link>
        </div>
    );
}

export default ProjectCard;