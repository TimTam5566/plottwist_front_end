/**
 * ProjectPage.jsx - Literary Theme
 * 
 * Displays a single project with the full story/poem
 * Each contribution shows the author name underneath
 */

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
    const [showPledgeModal, setShowPledgeModal] = useState(false);

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

    // Format content into paragraphs
    const formatContent = (content) => {
        if (!content) return null;
        
        const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
        
        return paragraphs.map((paragraph, index) => (
            <p key={index} className="content-paragraph">
                {paragraph.trim()}
            </p>
        ));
    };

    // Format verses (for poems - split by single newline)
    const formatVerses = (content) => {
        if (!content) return null;
        
        const lines = content.split(/\n/).filter(line => line.trim());
        
        return lines.map((line, index) => (
            <p key={index} className="content-verse">
                {line.trim()}
            </p>
        ));
    };

    // Choose formatting based on content type
    const renderContent = (content, isFirstSection = false) => {
        if (!content) return <p className="no-content">No content yet...</p>;
        
        if (project?.content_type === 'poem') {
            return formatVerses(content);
        }
        return formatContent(content);
    };

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
        setShowPledgeModal(false); // Close modal on success
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
        <div className="project-page">
            <div className="page-wrap">
                {loading && (
                    <div className="loading-state">
                        <span className="loading-icon">📖</span>
                        <p>Opening the book...</p>
                    </div>
                )}
                
                {error && (
                    <div className="error-state">
                        <p>Alas! The page seems to be missing from our library.</p>
                        <p className="error-detail">{error}</p>
                    </div>
                )}
                
                {project && !error && (
                    <article className="project-article">
                        {/* Header */}
                        <header className="project-header">
                            <div className="header-content">
                                <h1 className="project-title">{project.title}</h1>
                                <div className="project-meta-tags">
                                    {project.genre && (
                                        <span className="meta-tag genre-tag">{project.genre}</span>
                                    )}
                                    {project.content_type && (
                                        <span className="meta-tag type-tag">
                                            {project.content_type === 'poem' ? '📜 Poem' : '📖 Story'}
                                        </span>
                                    )}
                                    <span className={`meta-tag status-tag ${project.is_open ? 'open' : 'closed'}`}>
                                        {project.is_open ? '✨ Open for contributions' : '📕 Completed'}
                                    </span>
                                </div>
                            </div>
                            {isProjectOwner() && (
                                <Link to={`/project/${project.id}/edit`} className="edit-button">
                                    ✎ Edit Project
                                </Link>
                            )}
                        </header>

                        {/* Featured Image */}
                        <div className="project-image-container">
                            <img
                                src={imageUrl}
                                alt={project?.title}
                                className="project-image"
                                onError={(e) => {
                                    e.target.src = "/images/default.jpg";
                                }}
                            />
                        </div>

                        {/* Description */}
                        <section className="project-section description-section">
                            <h2 className="section-title">
                                <span className="flourish">❧</span>
                                The Tale
                                <span className="flourish">❧</span>
                            </h2>
                            <p className="project-description">{project.description}</p>
                        </section>

                        {/* Progress Tracker */}
                        <section className="project-section progress-section">
                            <h2 className="section-title">
                                <span className="flourish">❧</span>
                                Journey Progress
                                <span className="flourish">❧</span>
                            </h2>
                            <div className="progress-card">
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill"
                                        style={{ width: `${calculatePledgeProgress()}%` }}
                                    />
                                </div>
                                <p className="progress-text">
                                    {project.pledges?.length || 0} contributions
                                    • {Math.round(calculatePledgeProgress())}% of {project.goal} {project.content_type === 'poem' ? 'verses' : 'paragraphs'}
                                </p>
                            </div>
                        </section>

                        {/* THE FULL STORY - Combined View */}
                        <section className="project-section content-section">
                            <h2 className="section-title">
                                <span className="flourish">❧</span>
                                {project.content_type === 'poem' ? 'The Complete Poem' : 'The Full Story'}
                                <span className="flourish">❧</span>
                            </h2>
                            
                            <div className="content-display full-story">
                                {/* Starting Content - by project owner */}
                                <div className="story-section story-opening">
                                    {renderContent(project.starting_content)}
                                    <p className="contribution-author">
                                        — {project.owner_username || 'The Author'}
                                        <span className="author-note">(Opening)</span>
                                    </p>
                                </div>

                                {/* All Pledges/Contributions */}
                                {project.pledges && project.pledges.length > 0 && (
                                    <>
                                        {project.pledges.map((pledge, index) => (
                                            <div key={pledge.id || index} className="story-section story-contribution">
                                                {renderContent(pledge.add_content || pledge.content)}
                                                <p className="contribution-author">
                                                    — {pledge.anonymous 
                                                        ? 'A Mysterious Stranger' 
                                                        : (pledge.supporter_username || 'A Contributor')}
                                                </p>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </section>

                        {/* Date */}
                        <p className="project-date">
                            Tale begun on {new Date(project.date_created).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>

                        {/* Pledge Form */}
                        {project.is_open && auth?.token && (
                            <section className="project-section contribute-section">
                                <h2 className="section-title">
                                    <span className="flourish">❧</span>
                                    Add Your Chapter
                                    <span className="flourish">❧</span>
                                </h2>
                                <p className="contribute-text">
                                    Have something to add to this tale?
                                </p>
                            </section>
                        )}

                        {/* Login prompt if not authenticated */}
                        {project.is_open && !auth?.token && (
                            <section className="project-section contribute-section">
                                <h2 className="section-title">
                                    <span className="flourish">❧</span>
                                    Add Your Chapter
                                    <span className="flourish">❧</span>
                                </h2>
                                <p className="contribute-text">
                                    Want to add your voice to this tale?
                                </p>
                                <Link to="/login" className="btn btn--primary contribute-btn">
                                    🪶 Sign In to Contribute
                                </Link>
                            </section>
                        )}

                        {/* Hint for logged-in users pointing to sticky button */}
                        {project.is_open && auth?.token && (
                            <div className="contribute-hint">
                                <p>Ready to add your voice?</p>
                            </div>
                        )}
                    </article>
                )}

                {/* Sticky Contribute Button - Fixed at bottom of screen */}
                {project && project.is_open && auth?.token && (
                    <button 
                        className="sticky-contribute-btn"
                        onClick={() => setShowPledgeModal(true)}
                    >
                        <span className="btn-icon">🪶</span>
                        Contribute
                    </button>
                )}
            </div>

            {/* Pledge Modal - Outside page-wrap for proper fixed positioning */}
            {showPledgeModal && (
                <div className="modal-overlay" onClick={() => setShowPledgeModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="modal-close" 
                            onClick={() => setShowPledgeModal(false)}
                            aria-label="Close"
                        >
                            ✕
                        </button>
                        <PledgeForm 
                            projectId={project?.id} 
                            project={project}
                            onSuccess={handlePledgeSuccess}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectPage;
