import { useState } from "react";
import useCreatePledge from "../hooks/use-create-pledge";
import "./PledgeForm.css";

function PledgeForm({ projectId, onSuccess }) {
    const [formData, setFormData] = useState({
        amount: "",
        add_content: "",
        anonymous: false,
    });

    const { createPledge, isLoading, error, success } = useCreatePledge();

    const formatContent = (content) => {
        // Split content by double newlines for paragraphs
        return content.split(/\n\n+/).map((paragraph, index) => (
            <p key={index}>{paragraph.trim()}</p>
        ));
    };

    const handleChange = (event) => {
        const { id, value, type, checked } = event.target;
        setFormData((prev) => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.amount || Number(formData.amount) <= 0) {
            alert("Your pledge must be numeric, noble, and not imaginary. The poets thank you in advance.");
            return;
        }
        if (!formData.add_content.trim()) {
            alert("Your contribution must be a heartfelt addition to the tapestry of creativity.");
            return;
        }

        try {
            const newPledge = await createPledge(projectId, {
            amount: Number(formData.amount),
            comment: formData.add_content,      // <-- Add this line
            add_content: formData.add_content,  // <-- Keep this line
            anonymous: formData.anonymous,
            });
            setFormData({ amount: "", add_content: "", anonymous: false });
            if (onSuccess) onSuccess(newPledge);
        } catch {
            // handled by hook
        }
    };

    return (
        <form onSubmit={handleSubmit} className="pledge-form">
            <h3>Make a Pledge</h3>

            {error && (
                <p style={{ color: "red" }}>
                    {(error.includes("401") || error.toLowerCase().includes("unauthorized"))
                        ? "The gates remain sealed — no credentials, no quest. Try again or forge a new identity."
                        : error}
                </p>
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