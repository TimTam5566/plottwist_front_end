import React from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import './ProjectCard.css';

function ProjectCard({ project }) {
    const defaultImage = '/images/default.jpg';

    // Function to handle image URLs as per backend recommendation
    const getImageUrl = (image) => {
        if (!image) return defaultImage;
        if (image.startsWith('http')) return image;
        return `${API_URL}${image}`;
    };

    return (
        <div className="project-card">
            <Link to={`/project/${project.id}`}>
                <img
                    src={getImageUrl(project.image)}
                    alt={project.title || "Project"}
                    className="project-image"
                    onError={(e) => {
                        console.error(`Image load failed for project ${project.id}:`, project.image);
                        e.target.src = defaultImage;
                    }}
                />
                <div className="project-card__content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                </div>
            </Link>
        </div>
    );
}

export default ProjectCard;