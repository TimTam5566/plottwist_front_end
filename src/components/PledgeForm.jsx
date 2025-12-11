/**
 * PledgeForm.jsx - Literary Theme
 * 
 * Form for contributing verses/paragraphs to a project
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/use-auth";
import useCreatePledge from "../hooks/use-create-pledge";
import { getWritingPrompt } from "../data/pledgePrompts";
import postPledge from "../api/post-pledge";
import "./PledgeForm.css";

const ERROR_MESSAGES = {
    PLEDGE_FAILED: "The muse momentarily lost her way. Shall we try again?",
    AMOUNT_REQUIRED: "How many verses shall you contribute to this tale?",
    CONTENT_REQUIRED: "Your creative spirit awaits its moment to shine..."
};

function PledgeForm({ projectId, project, onSuccess }) {
    console.debug('PledgeForm mounting...', {
        projectId,
        project,
        hasProject: Boolean(project),
        projectGenre: project?.genre,
        timestamp: new Date().toISOString()
    });

    const { auth } = useAuth();
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        amount: "",
        add_content: "",
        comment: "",
        anonymous: false,
    });
    const [promptData, setPromptData] = useState(null);

    const { createPledge, isLoading, error: submissionError, success } = useCreatePledge();

    useEffect(() => {
        console.debug('PledgeForm props:', { projectId, project });
    }, [projectId, project]);

    const formatContent = (content) => {
        return content.split(/\n\n+/).map((paragraph, index) => (
            <p key={index}>{paragraph.trim()}</p>
        ));
    };

    const generateNewPrompt = useCallback(() => {
        if (formData.amount > 0) {
            const prompt = getWritingPrompt(
                null,
                Number(formData.amount),
                "verse"
            );
            setPromptData(prompt);
        }
    }, [formData.amount]);

    const handleChange = (event) => {
        const { id, value, type, checked } = event.target;
        const newValue = type === "checkbox" ? checked : value;
        
        setFormData((prev) => ({
            ...prev,
            [id]: newValue,
        }));

        if (id === 'amount' && value && Number(value) > 0) {
            generateNewPrompt();
        }
    };

    const [validationErrors, setValidationErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.add_content?.trim()) {
            setError("Content is required");
            return;
        }

        try {
            const pledgeData = {
                amount: Number(formData.amount),
                add_content: formData.add_content.trim(),
                comment: formData.comment.trim() || `Contributed ${formData.amount} verse(s)`,
                anonymous: formData.anonymous
            };

            await createPledge(projectId, pledgeData);
            
            setFormData({
                amount: "",
                add_content: "",
                comment: "",
                anonymous: false
            });
            
            onSuccess?.();
        } catch (err) {
            setError(ERROR_MESSAGES.PLEDGE_FAILED);
            console.error("Pledge submission error:", err);
        }
    };

    useEffect(() => {
        console.debug('Project data changed:', project);
        if (project && formData.amount) {
            generateNewPrompt();
        }
    }, [project, formData.amount, generateNewPrompt]);

    return (
        <div className="pledge-form-wrapper">
            <form onSubmit={handleSubmit} className="pledge-form">
                <div className="form-header">
                    <span className="form-icon">🪶</span>
                    <h3>Add Your Voice</h3>
                    <p className="form-subtitle">Contribute to this unfolding tale...</p>
                </div>

                {error && (
                    <div className="error-message" role="alert">
                        <p>{ERROR_MESSAGES.PLEDGE_FAILED}</p>
                    </div>
                )}
                
                {success && (
                    <div className="success-message">
                        <p>✨ Your contribution has been woven into the story!</p>
                    </div>
                )}

                <div className="form-field">
                    <label htmlFor="amount">How many verses or paragraphs?</label>
                    <input
                        type="number"
                        id="amount"
                        placeholder="Enter a number..."
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min={1}
                    />
                </div>

                {/* Prompt display section */}
                <div className="prompt-section">
                    <div className="prompt-display">
                        {promptData ? (
                            <>
                                <p className="prompt-text">{promptData.promptText}</p>
                                <p className="pledge-text">{promptData.pledgeText}</p>
                            </>
                        ) : (
                            <p className="prompt-placeholder">
                                {formData.amount > 0 
                                    ? "Click below to receive inspiration from the muse..." 
                                    : "Enter a number above to unlock a writing prompt..."}
                            </p>
                        )}
                    </div>

                    {formData.amount > 0 && (
                        <button 
                            type="button"
                            onClick={generateNewPrompt}
                            className="btn btn--generate"
                        >
                            🎲 Summon the Muse
                        </button>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="add_content">Your Contribution <span className="required">*</span></label>
                    <textarea
                        id="add_content"
                        placeholder="Let your words flow... Press Enter twice for new paragraphs."
                        value={formData.add_content}
                        onChange={handleChange}
                        required
                        rows="8"
                    />
                </div>

                {/* Comment field */}
                <div className="form-field">
                    <label htmlFor="comment">A Note to Fellow Authors (optional)</label>
                    <textarea
                        id="comment"
                        placeholder="Share your thoughts about this contribution..."
                        value={formData.comment}
                        onChange={handleChange}
                        rows="2"
                        className="comment-field"
                    />
                </div>

                {/* Preview section */}
                {formData.add_content && (
                    <div className="content-preview">
                        <h4>📖 Preview:</h4>
                        <div className="formatted-content">
                            {formatContent(formData.add_content)}
                        </div>
                    </div>
                )}

                <div className="form-field checkbox-field">
                    <label htmlFor="anonymous" className="checkbox-label">
                        <input
                            type="checkbox"
                            id="anonymous"
                            checked={formData.anonymous}
                            onChange={handleChange}
                        />
                        <span className="checkbox-text">Contribute as a mysterious stranger</span>
                    </label>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn--primary" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner">✒</span>
                                Weaving words...
                            </>
                        ) : (
                            "Submit Your Contribution"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PledgeForm;

