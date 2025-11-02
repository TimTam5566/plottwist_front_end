export const genreImages = {
    "Thriller": "/images/thriller.jpg",
    "Romance": "/images/romance.jpg",
    "Modern Drama": "/images/drama.jpg",
    "Historical": "/images/historical.jpg",
    "Comedy": "/images/comedy.jpg",
    "Childrens Fiction": "/images/children.jpg",
    "Fantasy/Mythology": "/images/fantasy.jpg"
};

export const getGenreImage = (genre) => {
    return genreImages[genre] || "/images/default.jpg";
};