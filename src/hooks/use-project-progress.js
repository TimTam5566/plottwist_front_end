export const useProjectProgress = () => {
    const calculateProgress = (currentContent, contentType, goal) => {
        if (!currentContent || !goal) return 0;
        const segments = contentType === 'poem' 
            ? currentContent.split('\n').filter(line => line.trim().length > 0)
            : currentContent.split(/\n\n+/).filter(para => para.trim().length > 0);
        
        const count = segments.length;
        const percentage = (count / goal) * 100;
        return Math.min(percentage, 100);
    };

    const getContentLabel = (contentType) => {
        return contentType === 'poem' ? 'Verses' : 'Paragraphs';
    };

    return { calculateProgress, getContentLabel };
};