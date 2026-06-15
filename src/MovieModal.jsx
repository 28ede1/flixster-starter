import { useEffect, useState } from 'react'
import { CloseIcon } from './assets/icons/Icons'
import './MovieModal.css'

const MovieModal = ({ movie, isLoading, error, onClose }) => {
    const [aiDescription, setAiDescription] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);

    // close on Escape; also lock body scroll while the modal is open
    useEffect(() => {
        const onKeyDown = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    // a new movie means the previous AI blurb no longer applies
    useEffect(() => {
        setAiDescription("");
        setAiError(null);
    }, [movie?.id]);

    const backdropUrl = movie?.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null;
    const title = movie?.title ?? "Untitled";
    const tagline = movie?.tagline ?? "";
    const year = movie?.release_date
        ? new Date(movie.release_date).getFullYear()
        : "—";
    const rating = movie?.vote_average ? movie.vote_average.toFixed(1) : "N/A";
    const runtime = movie?.runtime
        ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
        : null;
    const genres = movie?.genres?.map((g) => g.name) ?? [];
    const overview = movie?.overview ?? "";

    // first official YouTube trailer (fall back to any YouTube video)
    const videos = movie?.videos?.results ?? [];
    const trailer =
        videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
        videos.find((v) => v.site === "YouTube");

    async function handleGenerateDescription() {
        if (!movie) return;
        setAiLoading(true);
        setAiError(null);
        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_OPEN_ROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "openrouter/free",
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are a film critic. Write a vivid, spoiler-free description of a movie in 2-3 sentences.",
                        },
                        {
                            role: "user",
                            content: `Write an engaging description for the movie "${title}" (${year}). Genres: ${genres.join(", ") || "unknown"}. Official synopsis: ${overview || "none available"}.`,
                        },
                    ],
                }),
            });
            if (!res.ok) throw new Error(`AI error ${res.status}`);
            const data = await res.json();
            const text = data.choices?.[0]?.message?.content?.trim();
            if (!text) throw new Error("No description returned");
            setAiDescription(text);
        } catch (err) {
            setAiError(err.message);
        } finally {
            setAiLoading(false);
        }
    }

    // clicking the dimmed backdrop (but not the panel itself) closes the modal
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    <CloseIcon className="modal-close-icon" />
                </button>

                {isLoading ? (
                    <div className="modal-status">• LOADING… •</div>
                ) : error ? (
                    <div className="modal-status modal-error">{error}</div>
                ) : (
                    <>
                        <div className="modal-hero">
                            {backdropUrl
                                ? <img src={backdropUrl} alt={`${title} backdrop`} />
                                : <div className="modal-hero-placeholder" />}
                            <div className="modal-hero-fade" />
                            <div className="modal-hero-text">
                                <h2 className="modal-title">{title}</h2>
                                {tagline && <p className="modal-tagline">{tagline}</p>}
                            </div>
                        </div>

                        <div className="modal-body">
                            <div className="modal-meta">
                                <span>{year}</span>
                                <span className="sep">/</span>
                                <span>★ {rating}</span>
                                {runtime && <><span className="sep">/</span><span>{runtime}</span></>}
                            </div>

                            {genres.length > 0 && (
                                <div className="modal-genres">
                                    {genres.map((g) => (
                                        <span key={g} className="genre-chip">{g}</span>
                                    ))}
                                </div>
                            )}

                            {overview && <p className="modal-overview">{overview}</p>}

                            {/* AI description */}
                            <div className="modal-section">
                                <div className="modal-section-head">
                                    <h3>AI Description</h3>
                                    <button
                                        className="ai-btn"
                                        onClick={handleGenerateDescription}
                                        disabled={aiLoading}
                                    >
                                        {aiLoading ? "• GENERATING… •" : "✦ Generate Description"}
                                    </button>
                                </div>
                                {aiError && <p className="modal-error">{aiError}</p>}
                                {aiLoading ? (
                                    <div className="ai-typing" aria-label="Generating description">
                                        <span></span><span></span><span></span>
                                    </div>
                                ) : aiDescription ? (
                                    <p className="ai-description">{aiDescription}</p>
                                ) : !aiError && (
                                    <p className="ai-placeholder">Generate a fresh, AI-written take on this film.</p>
                                )}
                            </div>

                            {/* Trailer */}
                            <div className="modal-section">
                                <h3>Trailer</h3>
                                {trailer ? (
                                    <div className="trailer-frame">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${trailer.key}`}
                                            title={`${title} trailer`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    <p className="ai-placeholder">No trailer available for this title.</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MovieModal
