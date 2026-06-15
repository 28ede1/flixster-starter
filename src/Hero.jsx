import './Hero.css'

const Hero = ({ movie, onOpen }) => {
    // nothing to show until App has movies loaded
    if (!movie) return null;

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null;
    const title = movie.title ?? "Untitled";
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
    const year = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : "—";
    const overview = movie.overview ?? "";

    return (
        <section className="hero">
            <div className="hero-media">
                {backdropUrl
                    ? <img src={backdropUrl} alt={`${title} backdrop`} />
                    : <div className="hero-placeholder" />}
                <div className="hero-fade"></div>
            </div>

            <div className="hero-content">
                <span className="hero-eyebrow">Now Playing in Theaters</span>
                <h1 className="hero-title">{title}</h1>
                <div className="hero-meta">
                    <span>{year}</span>
                    <span className="sep">/</span>
                    <span>★ {rating}</span>
                </div>
                {overview && <p className="hero-overview">{overview}</p>}
                <button className="hero-btn" onClick={() => onOpen?.(movie)}>
                    ▶ View Movie
                </button>
            </div>
        </section>
    );
}

export default Hero
