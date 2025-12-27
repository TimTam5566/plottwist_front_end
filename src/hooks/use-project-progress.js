/**
 * ============================================================
 * USE-PROJECT-PROGRESS.JS - Progress Calculation
 * ============================================================
 * 
 * WHAT THIS DOES:
 * Calculates how much progress a project has made toward its goal.
 * Handles both poems (count verses/lines) and stories (count paragraphs).
 * 
 * RETURNS:
 * - calculateProgress: Function to get percentage
 * - getContentLabel: Function to get "Verses" or "Paragraphs"
 */

export const useProjectProgress = () => {

    /**
     * Calculate what percentage of the goal is complete.
     * 
     * currentContent - The full story/poem text
     * contentType - "poem" or "story"
     * goal - Target number of contributions
     * returns Number between 0-100
     */

    const calculateProgress = (currentContent, contentType, goal) => {
        // Handle missing data
        if (!currentContent || !goal) return 0;

        // ========== COUNT SEGMENTS ==========
        /**
         * POEMS: Split by single newlines, count non-empty lines
         * STORIES: Split by double newlines (paragraphs), count non-empty
         */

        const segments = contentType === 'poem' 
            ? currentContent.split('\n').filter(line => line.trim().length > 0)
            : currentContent.split(/\n\n+/).filter(para => para.trim().length > 0);
        
        // ========== CALCULATE PERCENTAGE ==========
        const count = segments.length;
        const percentage = (count / goal) * 100;

        // Cap at 100% (can't be more than complete!)
        return Math.min(percentage, 100);
    };

    /**
     * Get the right label based on content type.
     * Used for UI: "5 Verses contributed" vs "5 Paragraphs contributed"
     */
    const getContentLabel = (contentType) => {
        return contentType === 'poem' ? 'Verses' : 'Paragraphs';
    };

    return { calculateProgress, getContentLabel };
};

/**
 * USAGE:
 * 
 * function ProjectProgress({ project }) {
 *     const { calculateProgress, getContentLabel } = useProjectProgress();
 *     
 *     const progress = calculateProgress(
 *         project.starting_content,
 *         project.content_type,
 *         project.goal
 *     );
 *     
 *     return (
 *         <div>
 *             <div className="progress-bar" style={{ width: `${progress}%` }} />
 *             <p>{progress.toFixed(0)}% - {getContentLabel(project.content_type)}</p>
 *         </div>
 *     );
 * }
 */