/**
 * HomePage.jsx - Literary Theme
 *
 * Layout:
 * - Hero with Welcome Scroll
 * - Featured Project (large)
 * - Other projects preview (smaller grid)
 *
 * Accessibility: main landmark, aria-live, descriptive alt text
 */

import { useMemo } from "react";
import useProjects from "../hooks/use-projects";
import ProjectCard from "../components/ProjectCard";
import WelcomeScroll from "../components/WelcomeScroll";
import { API_URL } from "../config";
import "./HomePage.css";
import { useAuth } from "../hooks/use-auth";
import { Link } from "react-router-dom";

function HomePage() {
    const { projects, isLoading, error, refetch } = useProjects();
    const { auth } = useAuth();

    // Memoize derived data to prevent unnecessary recalculations
    const { featuredProject, otherProjects } = useMemo(() => ({
        featuredProject: projects && projects.length > 0 ? projects[0] : null,
        otherProjects: projects && projects.length > 1 ? projects.slice(1) : []
    }), [projects]);

    if (isLoading) {
        return (
            <main id="main-content" className="home-page">
                <div className="page-wrap">
                    <WelcomeScroll />
                    <div className="loading-message" role="status" aria-live="polite">
                        <p className="muted">Gathering stories from the archives...</p>
                        <div className="loading-quill" aria-hidden="true">✒</div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main id="main-content" className="home-page">
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
            </main>
        );
    }

    const isProjectOwner = (project) => {
        return parseInt(auth?.user_id) === project.owner;
    };

    return (
        <main id="main-content" className="home-page">
            <div className="page-wrap">
                {/* Welcome Scroll Section */}
                <section className="hero-section" aria-label="Welcome">
                    <WelcomeScroll />
                </section>

                {/* Featured Project Section */}
                {featuredProject && (
                    <section className="featured-section" aria-label="Featured story">
                        <h2 className="section-title">
                            <span className="flourish-left" aria-hidden="true">❧</span>
                            Featured Story
                            <span className="flourish-right" aria-hidden="true">❧</span>
                        </h2>
                        <div className="featured-project">
                            <FeaturedProjectCard
                                project={featuredProject}
                                isOwner={isProjectOwner(featuredProject)}
                            />
                        </div>
                    </section>
                )}

                {/* Other Projects Section */}
                {otherProjects.length > 0 && (
                    <section className="projects-section" aria-label="More stories">
                        <h2 className="section-title">
                            <span className="flourish-left" aria-hidden="true">❧</span>
                            More Stories to Explore
                            <span className="flourish-right" aria-hidden="true">❧</span>
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

                {/* Empty State */}
                {(!projects || projects.length === 0) && (
                    <section className="empty-section" aria-label="No stories yet">
                        <div className="empty-message">
                            <p className="empty-title">The library awaits its first story...</p>
                            <p className="empty-subtitle">Be the first to create a tale!</p>
                            <Link to="/create-project" className="btn btn--primary">
                                Begin Writing
                            </Link>
                        </div>
                    </section>
                )}

                {/* Call to Action */}
                <section className="cta-section" aria-label="Create your story">
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
        </main>
    );
}

/**
 * FeaturedProjectCard - A larger, more prominent card for the featured project
 */
function FeaturedProjectCard({ project, isOwner }) {
    if (!project) return null;

    const defaultImage = '/images/default.jpg';

    const getImageUrl = (image) => {
        if (!image) return defaultImage;
        if (image.startsWith('http')) return image;
        return `${API_URL}${image}`;
    };

    return (
        <div className="featured-card">
            <div className="featured-card__image-container">
                <img
                    src={getImageUrl(project.image)}
                    alt={`Cover image for ${project.title}${project.genre ? `, a ${project.genre} ${project.content_type || 'project'}` : ''}`}
                    className="featured-card__image"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = defaultImage;
                    }}
                />
            </div>
            <div className="featured-card__content">
                <Link to={`/project/${project.id}`} className="featured-card__title-link">
                    <h3 className="featured-card__title">{project.title}</h3>
                </Link>

                {isOwner && (
                    <Link to={`/project/${project.id}/edit`} className="edit-button">
                        Edit Project
                    </Link>
                )}

                <p className="featured-card__description">{project.description}</p>

                <div className="featured-card__meta">
                    {project.genre && (
                        <span className="meta-tag genre-tag">{project.genre}</span>
                    )}
                    {project.content_type && (
                        <span className="meta-tag type-tag">{project.content_type}</span>
                    )}
                </div>

                <Link to={`/project/${project.id}`} className="btn btn--primary featured-card__btn">
                    Read This Story
                </Link>
            </div>
        </div>
    );
}

export default HomePage;
