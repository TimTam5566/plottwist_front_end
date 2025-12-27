/**
 * ============================================================
 * HOMEPAGE.JSX - Main Landing Page
 * ============================================================
 * 
 * WHAT THIS DOES:
 * 1. Fetches all projects from API
 * 2. Displays a featured project (first one)
 * 3. Shows other projects in a grid
 * 4. Handles loading and error states
 * 
 * LAYOUT:
 * - Hero section with WelcomeScroll
 * - Featured project (large card)
 * - Other projects (smaller grid)
 * - Call-to-action section
 */

import useProjects from "../hooks/use-projects";
import ProjectCard from "../components/ProjectCard";
import WelcomeScroll from "../components/WelcomeScroll";
import "./HomePage.css";
import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { Link } from "react-router-dom";

function HomePage() {
    // ============================================================
    // HOOKS
    // ============================================================
    
    /**
     * useProjects is a CUSTOM HOOK that:
     * 1. Calls getProjects() API function
     * 2. Manages loading state
     * 3. Handles errors
     * 4. Provides refetch function
     * 
     * Returns: { projects, isLoading, error, refetch }
     */
    const { projects, isLoading, error, refetch } = useProjects();
    // Get auth for checking project ownership
    const { auth } = useAuth();

    // ============================================================
    // LOADING STATE
    // ============================================================
    /**
     * While fetching data, show a loading message.
     * The quill animation adds a nice touch!
     */

    if (isLoading) {
        return (
            <div className="home-page">
                <div className="page-wrap">
                    <WelcomeScroll />
                    <div className="loading-message">
                        <p className="muted">Gathering stories from the archives...</p>
                        <div className="loading-quill">✒</div>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // ERROR STATE
    // ============================================================
    /**
     * If API call fails, show error with retry button.
     * Literary themed error message fits your brand!
     */

    if (error) {
        return (
            <div className="home-page">
                <div className="page-wrap">
                    <WelcomeScroll />
                    <div className="error-container" role="alert">
                        <p className="error-message-literary">
                            The archive whispered, "Not now, dear reader."
                        </p>
                        <p className="muted">{error.message}</p>
                        <button onClick={refetch} className="btn btn--primary" disabled={isLoading}>
                            {isLoading ? "Searching..." : "Try Again"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // HELPER FUNCTION
    // ============================================================
    /**
     * Check if current user owns a project.
     * Used to show/hide "Edit" button.
     * 
     * parseInt() because auth.user_id might be a string from localStorage
     */

    const isProjectOwner = (project) => {
        return parseInt(auth?.user_id) === project.owner;
    };

    // ============================================================
    // DATA PROCESSING
    // ============================================================
    /**
     * Split projects into featured (first) and others (rest).
     * 
     * Array destructuring:
     * - projects[0] = featured
     * - projects.slice(1) = everything else
     */

    // Get featured project (first one, or you could add logic to pick a specific one)
    const featuredProject = projects && projects.length > 0 ? projects[0] : null;
    
    // Get other projects (everything except featured)
    const otherProjects = projects && projects.length > 1 ? projects.slice(1) : [];

    // ============================================================
    // RENDER
    // ============================================================
    return (
        <div className="home-page">
            <div className="page-wrap">
                {/* Welcome Scroll Section */}
                <section className="hero-section">
                    <WelcomeScroll />
                </section>

                {/* ========== FEATURED PROJECT ========== */}
                {/**
                 * Conditional rendering: Only show if there's a featured project.
                 * Uses && (short-circuit evaluation):
                 * - If featuredProject is null/undefined → nothing renders
                 * - If featuredProject exists → section renders
                 */}

                {featuredProject && (
                    <section className="featured-section">
                        <h2 className="section-title">
                            <span className="flourish-left">❧</span>
                            Featured Story
                            <span className="flourish-right">❧</span>
                        </h2>
                        <div className="featured-project">
                            <FeaturedProjectCard 
                                project={featuredProject} 
                                isOwner={isProjectOwner(featuredProject)} 
                            />
                        </div>
                    </section>
                )}

                {/* ========== OTHER PROJECTS GRID ========== */}
                {/**
                 * Map through remaining projects and create cards.
                 * 
                 * .map() transforms array:
                 * [project1, project2] → [<ProjectCard />, <ProjectCard />]
                 * 
                 * key={project.id} helps React track which items changed.
                 */}

                {otherProjects.length > 0 && (
                    <section className="projects-section">
                        <h2 className="section-title">
                            <span className="flourish-left">❧</span>
                            More Stories to Explore
                            <span className="flourish-right">❧</span>
                        </h2>
                        <div className="project-list">
                            {otherProjects.map((project) => (
                                <ProjectCard 
                                    key={project.id} 
                                    project={project} 
                                    isOwner={isProjectOwner(project)} 
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* ========== EMPTY STATE ========== */}
                {/**
                 * Show when there are NO projects at all.
                 * Encourages users to create the first one!
                 */}
                
                {(!projects || projects.length === 0) && (
                    <section className="empty-section">
                        <div className="empty-message">
                            <p className="empty-title">The library awaits its first story...</p>
                            <p className="empty-subtitle">Be the first to create a tale!</p>
                            <Link to="/create-project" className="btn btn--primary">
                                Begin Writing
                            </Link>
                        </div>
                    </section>
                )}

                {/* ========== CALL TO ACTION ========== */}
                <section className="cta-section">
                    <div className="cta-content">
                        <p className="cta-text">Ready to write your own adventure?</p>
                        <Link to="/create-project" 
                        className="btn btn--primary"
                        onClick={() => window.scrollTo(0, 0)}
                        >
                            Create Your Story
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

// ============================================================
// FEATURED PROJECT CARD COMPONENT
// ============================================================
/**
 * A larger, more prominent card for the featured project.
 * Defined in the same file (could be separate component).
 * 
 * Props:
 * - project: The project data object
 * - isOwner: Boolean - does current user own this project?
 */

function FeaturedProjectCard({ project, isOwner }) {
    if (!project) return null;
    // Default image if none provided
    const defaultImage = '/images/default.jpg';
    const API_URL = import.meta.env.VITE_API_URL || '';

    /**
     * Handle image URLs:
     * - Cloudinary URLs start with "http" → use as-is
     * - Relative URLs → prepend API_URL
     * - No image → use default
     */

    const getImageUrl = (image) => {
        if (!image) return defaultImage;
        if (image.startsWith('http')) return image; // Cloudinary URL
        return `${API_URL}${image}`; // Relative URL
    };

    return (
        <div className="featured-card">
            {/* Image */}
            <div className="featured-card__image-container">
                <img
                    src={getImageUrl(project.image)}
                    alt={project.title || "Featured Project"}
                    className="featured-card__image"
                    onError={(e) => {
                        // If image fails to load, show default
                        e.target.src = defaultImage;
                    }}
                />
            </div>
            {/* Content */}
            <div className="featured-card__content">
                <Link to={`/project/${project.id}`} className="featured-card__title-link">
                    <h3 className="featured-card__title">{project.title}</h3>
                </Link>
                {/* Edit button - only for owner */}
                {isOwner && (
                    <Link to={`/project/${project.id}/edit`} className="edit-button">
                        Edit Project
                    </Link>
                )}
                
                <p className="featured-card__description">{project.description}</p>
                {/* Meta tags */}
                <div className="featured-card__meta">
                    {project.genre && (
                        <span className="meta-tag genre-tag">{project.genre}</span>
                    )}
                    {project.content_type && (
                        <span className="meta-tag type-tag">{project.content_type}</span>
                    )}
                </div>
                {/* CTA - Call To Action Button */}
                <Link to={`/project/${project.id}`} className="btn btn--primary featured-card__btn">
                    Read This Story
                </Link>
            </div>
        </div>
    );
}

export default HomePage;
