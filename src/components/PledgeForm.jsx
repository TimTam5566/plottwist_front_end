/**
 * PledgeForm.jsx - Literary Theme
 *
 * Form for contributing verses/paragraphs to a project.
 * Accessibility: aria-live on messages, aria-describedby on fields,
 * aria-required, aria-busy on submit button.
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/use-auth";
import useCreatePledge from "../hooks/use-create-pledge";
import { getWritingPrompt } from "../data/pledgePrompts";
import "./PledgeForm.css";

const ERROR_MESSAGES = {
    PLEDGE_FAILED: "The muse momentarily lost her way. Shall we try again?",
    AMOUNT_REQUIRED: "How many verses shall you contribute to this tale?",
    CONTENT_REQUIRED: "Your creative spirit awaits its moment to shine..."
};

function PledgeForm({ projectId, project, onSuccess, modalTitleId }) {
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
        }
    };

    useEffect(() => {
        if (project && formData.amount) {
            generateNewPrompt();
        }
    }, [project, formData.amount, generateNewPrompt]);

    return (
        <div className="pledge-form-wrapper">
            <form onSubmit={handleSubmit} className="pledge-form" aria-label="Contribution form">
                <div className="form-header">
                    <span className="form-icon" aria-hidden="true">🪶</span>
                    <h3 id={modalTitleId || "pledge-form-title"}>Add Your Voice</h3>
                    <p className="form-subtitle">Contribute to this unfolding tale...</p>
                </div>

                {error && (
                    <div className="error-message" role="alert" aria-live="assertive" id="pledge-error">
                        <p>{ERROR_MESSAGES.PLEDGE_FAILED}</p>
                    </div>
                )}

                {success && (
                    <div className="success-message" role="status" aria-live="polite">
                        <p><span aria-hidden="true">✨ </span>Your contribution has been woven into the story!</p>
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
                        aria-required="true"
                        min={1}
                        aria-describedby={error ? "pledge-error" : undefined}
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
                            <span aria-hidden="true">🎲 </span>Summon the Muse
                        </button>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="add_content">
                        Your Contribution <span className="required" aria-label="required">*</span>
                    </label>
                    <textarea
                        id="add_content"
                        placeholder="Let your words flow... Press Enter twice for new paragraphs."
                        value={formData.add_content}
                        onChange={handleChange}
                        required
                        aria-required="true"
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
                    <div className="content-preview" aria-label="Content preview">
                        <h4><span aria-hidden="true">📖 </span>Preview:</h4>
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
                    <button
                        type="submit"
                        className="btn btn--primary"
                        disabled={isLoading}
                        aria-busy={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner" aria-hidden="true">✒</span>
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
