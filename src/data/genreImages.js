const BASE_URL = import.meta.env.PROD 
    ? 'https://plottwistyouaretheauthor.netlify.app/images'
    : '/images';

export const genreImages = {
    "Thriller": `${BASE_URL}/thriller.jpg`,
    "Romance": `${BASE_URL}/romance.jpg`,
    "Modern Drama": `${BASE_URL}/drama.jpg`,
    "Historical": `${BASE_URL}/historical.jpg`,
    "Comedy": `${BASE_URL}/comedy.jpg`,
    "Childrens Fiction": `${BASE_URL}/children.jpg`,
    "Fantasy/Mythology": `${BASE_URL}/fantasy.jpg`
};

export const getGenreImage = (genre, uploadedImage = null) => {
    if (uploadedImage) {
        return uploadedImage;
    }
    return genreImages[genre] || `${BASE_URL}/default.jpg`;
};