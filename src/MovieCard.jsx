import { FavoriteIcon, VisibilityIcon } from './assets/icons/Icons'

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
        <div className={`MovieCard${liked ? " is-liked" : ""}${watched ? " is-watched" : ""}`}>
            <div className="poster-wrap">
                {posterUrl
                    ? <img src={posterUrl} alt={`${title} poster`} />
                    : <div className="poster-placeholder" />}

                {/* number always present, top-left, glass pill like the rating */}
                <span className="movie-number">{numberTag}</span>

                {/* darkening gradient fades in on hover (Apple-TV style) */}
                <div className="poster-overlay" />

                {/* watched marker stays on the (darkened) poster so it reads at a glance */}
                {watched && (
                    <span className="watched-marker" title="Watched">
                        <VisibilityIcon className="watched-marker-icon" /> Watched
                    </span>
                )}

                {/* icon-only circle actions, top-right, revealed on hover */}
                <div className="movie-actions">
                    <button
                        className={liked ? "icon-btn liked active" : "icon-btn liked"}
                        aria-pressed={liked}
                        aria-label={liked ? "Remove from favorites" : "Add to favorites"}
                        title={liked ? "Remove from favorites" : "Add to favorites"}
                        onClick={() => onToggleLike(movie_info.id)}
                    >
                        <FavoriteIcon className="btn-icon" />
                    </button>
                    <button
                        className={watched ? "icon-btn watched active" : "icon-btn watched"}
                        aria-pressed={watched}
                        aria-label={watched ? "Remove from watched" : "Add to watched"}
                        title={watched ? "Remove from watched" : "Add to watched"}
                        onClick={() => onToggleWatched(movie_info.id)}
                    >
                        <VisibilityIcon className="btn-icon" />
                    </button>
                </div>

                {/* rating always visible, bottom-right, glass pill */}
                <span className="rating-badge">★ {voteAverage}</span>
            </div>

            {/* title + year on one line below the poster: title left, year right */}
            <div className="movie-meta">
                <span className="movie-title">{title}</span>
                <span className="movie-year">{releaseDate}</span>
            </div>
        </div>
    )
}

export default MovieCard
