import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/use-auth";
import useCreatePledge from "../hooks/use-create-pledge";
import { getWritingPrompt } from "../data/pledgePrompts";
import postPledge from "../api/post-pledge"; // Add this if not already imported
import "./PledgeForm.css";

const ERROR_MESSAGES = {
    PLEDGE_FAILED: "The muse momentarily lost her way. Shall we try again?",
    AMOUNT_REQUIRED: "How many verses shall you contribute to this tale?",
    CONTENT_REQUIRED: "Your creative spirit awaits its moment to shine..."
};

function PledgeForm({ projectId, project, onSuccess }) {
    // Update initial debug log with more detail
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
        comment: "",  // Add comment field
        anonymous: false,
    });
    const [promptData, setPromptData] = useState(null);

    const { createPledge, isLoading, error: submissionError, success } = useCreatePledge();

    // First useEffect - Fix empty dependency array
    useEffect(() => {
        console.debug('PledgeForm props:', { projectId, project });
    }, [projectId, project]); // Add required dependencies

    const formatContent = (content) => {
        // Split content by double newlines for paragraphs
        return content.split(/\n\n+/).map((paragraph, index) => (
            <p key={index}>{paragraph.trim()}</p>
        ));
    };

    // Second useEffect - Memoize generateNewPrompt
    const generateNewPrompt = useCallback(() => {
        if (formData.amount > 0) {
            const prompt = getWritingPrompt(
                null, // No need to pass project since we're not using genre
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

        // Generate prompt only for new amounts
        if (id === 'amount' && value && Number(value) > 0) {
            generateNewPrompt();
        }
    };

    // Keep existing error state for form validation
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
    }, [project, formData.amount, generateNewPrompt]); // Add all required dependencies

    return (
        <form onSubmit={handleSubmit} className="pledge-form">
            {error && (
                <div className="error-message" role="alert">
                    <p>{ERROR_MESSAGES.PLEDGE_FAILED}</p>
                </div>
            )}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <div>
                <label htmlFor="amount">How many verses/paragraphs?</label>
                <input
                    type="number"
                    id="amount"
                    placeholder="Enter number of verses or paragraphs"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min={1}
                />
            </div>

            {/* Prompt display section */}
            <div className="prompt-section">
                <div className="prompt-display">
                    {console.log('Rendering prompt display:', promptData)}
                    {promptData ? (
                        <>
                            <p className="prompt-text">{promptData.promptText}</p>
                            <p className="pledge-text">{promptData.pledgeText}</p>
                        </>
                    ) : (
                        <p className="prompt-placeholder">
                            {formData.amount > 0 
                                ? "Click 'Generate Writing Prompt' to get started..." 
                                : "Enter the number of verses/paragraphs to receive a writing prompt..."}
                        </p>
                    )}
                </div>

                {formData.amount > 0 && (
                    <button 
                        type="button"
                        onClick={generateNewPrompt}
                        className="generate-prompt-btn"
                    >
                        🎲 Generate Writing Prompt
                    </button>
                )}
            </div>

            <div>
                <label htmlFor="add_content">Your Contribution *</label>
                <textarea
                    id="add_content"
                    placeholder="Add your verse or paragraph here... Press Enter twice for new paragraphs."
                    value={formData.add_content}
                    onChange={handleChange}
                    required
                    rows="10"
                    style={{
                        whiteSpace: "pre-wrap",
                        minHeight: "150px",
                        padding: "10px",
                        lineHeight: "1.5"
                    }}
                />
            </div>

            {/* New comment field */}
            <div className="form-group">
                <label htmlFor="comment">Additional Comment (optional)</label>
                <textarea
                    id="comment"
                    placeholder="Add a comment about your contribution..."
                    value={formData.comment}
                    onChange={handleChange}
                    className="pledge-comment"
                    rows="2"
                />
            </div>

            {/* Keep existing preview section */}
            {formData.add_content && (
                <div className="content-preview">
                    <h4>Preview:</h4>
                    <div className="formatted-content">
                        {formatContent(formData.add_content)}
                    </div>
                </div>
            )}

            <div>
                <label htmlFor="anonymous">
                    <input
                        type="checkbox"
                        id="anonymous"
                        checked={formData.anonymous}
                        onChange={handleChange}
                    />
                    Pledge anonymously
                </label>
            </div>

            <button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Pledge"}
            </button>
        </form>
    );
}

export default PledgeForm;

