/**
 * ProjectCard component
 * Displays a project's details in a card format including:
 * - Title (linked to project page)
 * - Image (with fallback)
 * - Description
 * - Pledges (if any)
 * - Project metadata (genre, type, goal)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

function ProjectCard({ project, isOwner = false }) {
    // Guard against undefined project
    if (!project) {
        return <div className="project-card loading">Loading...</div>;
    }

    const defaultImage = '/images/default.jpg';

    const getImageUrl = (image) => {
        if (!image) return defaultImage;
        if (image.startsWith('http')) return image;
        return `${API_URL}${image}`;
    };

    return (
        <div className="project-card">
            <Link to={`/project/${project.id}`}>
                <h3>{project.title}</h3>
            </Link>
            {isOwner && (
                <Link to={`/project/${project.id}/edit`} className="edit-button">
                    Edit Project
                </Link>
            )}
            <img
                src={getImageUrl(project.image)}
                alt={project.title || "Project"}
                className="project-image"
                onError={(e) => {
                    console.error(`Image load error for project ${project.id}`);
                    e.target.src = defaultImage;
                }}
            />

            <div className="project-card__content">
                <p className="project-description">{project.description}</p>

                {/* Display pledges if they exist */}
                {project.pledges && project.pledges.length > 0 && (
                    <div className="project-pledges">
                        {project.pledges.map((pledge) => (
                            <div key={pledge.id} className="pledge-entry">
                                <div className="pledge-content">
                                    <p>{pledge.content}</p>
                                    <span className="pledger-attribution">
                                        — {pledge.pledger?.username || 'Anonymous'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="project-meta">
                    <span className="project-genre">{project.genre}</span>
                    <span className="project-type">{project.content_type}</span>
                    <span className="project-goal">Goal: {project.goal}</span>
                </div>
            </div>
        </div>
    );
}

ProjectCard.defaultProps = {
    isOwner: false
};

export default ProjectCard;