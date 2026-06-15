const MovieCard = ({movie_info, movie_number, liked, watched, onToggleLike, onToggleWatched}) => {
    const posterUrl = movie_info.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie_info.poster_path}`
    : null;
    const title = movie_info.title
    ? movie_info.title
    : "Untitled";
    const voteAverage = movie_info.vote_average
    ? movie_info.vote_average.toFixed(1)
    : "N/A";
    const releaseDate = movie_info.release_date
    ? new Date(movie_info.release_date).getFullYear()
    : "Unknown";

    // liked/watched are owned by App (so the Library can filter on them);
    // this card just reports clicks back up via the toggle callbacks
    const numberTag = String(movie_number).padStart(3, "0");
    return (
        <div className="MovieCard">
            <span className="movie-number">{numberTag}</span>
            <span>{title}</span>
            <span>★ {voteAverage}</span>
            <span>{releaseDate}</span>
            {posterUrl ? <img src={posterUrl} alt={`${title} poster`} /> : <div className="poster-placeholder" />}
            <div className="movie-actions">
                <button
                    className={liked ? "liked active" : "liked"}
                    aria-pressed={liked}
                    onClick={() => onToggleLike(movie_info.id)}
                >
                    {liked ? "❤️ Liked" : "🤍 Like"}
                </button>
                <button
                    className={watched ? "watched active" : "watched"}
                    aria-pressed={watched}
                    onClick={() => onToggleWatched(movie_info.id)}
                >
                    {watched ? "✅ Watched" : "👁️ Watched?"}
                </button>
            </div>
        </div>
    )
}

export default MovieCard
