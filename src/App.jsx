import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import './App.css'
import Header from './Header'
import Footer from './Footer'
import Hero from './Hero'
import MovieList from './MovieList'
import SortControl from './SortControl'
import MovieModal from './MovieModal'

const App = () => {
  const [movies, setMovieData] = useState([]); //we need a way to remember data between renders so we use useState
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  // likes/watched are sets of movie ids, owned by App so the Library can filter on them
  const [likes, setLikes] = useState(() => new Set());
  const [watched, setWatched] = useState(() => new Set());
  // the active Library filter now lives in the URL instead of state:
  //   /          -> "all"
  //   /favorites -> "favorited"
  //   /watched   -> "watched"
  const location = useLocation();
  const navigate = useNavigate();
  const view =
    location.pathname === "/favorites" ? "favorited"
    : location.pathname === "/watched" ? "watched"
    : "all";
  const [heroMovie, setHeroMovie] = useState(null); // random featured movie, locked once chosen
  const [sortBy, setSortBy] = useState(null); // null | "az" | "newest" | "rating"
  // null = no modal open; otherwise the full details object for the selected movie
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  async function fetchNowPlaying(pageToFetch) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_API_KEY}&page=${pageToFetch}`
      );

      if (!res.ok) {
        throw new Error(`TMDb error ${res.status}`);
      }

      const data = await res.json();
      const results = data.results ?? [];
      // page 1 replaces the list (fresh load); later pages append (load more)
      setMovieData((prev) => (pageToFetch === 1 ? results : [...prev, ...results]));
      setTotalPages(data.total_pages ?? 1);
    } catch (err) {
      // keep whatever movies are already on screen; just surface the error
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchSearch(query, pageToFetch) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${pageToFetch}`
      );

      if (!res.ok) {
        throw new Error(`TMDb error ${res.status}`);
      }

      const data = await res.json();
      const results = data.results ?? [];
      setMovieData((prev) => (pageToFetch === 1 ? results : [...prev, ...results]));
      setTotalPages(data.total_pages ?? 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // fetch full details (runtime, tagline, genres) + trailers for the modal.
  // append_to_response=videos folds the trailers into the same request.
  async function openMovie(movieId) {
    setSelectedMovie({ id: movieId }); // open immediately so the modal can show its loading state
    setDetailsLoading(true);
    setDetailsError(null);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&append_to_response=videos`
      );

      if (!res.ok) {
        throw new Error(`TMDb error ${res.status}`);
      }

      const data = await res.json();
      setSelectedMovie(data);
    } catch (err) {
      setDetailsError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  }

  const closeMovie = () => {
    setSelectedMovie(null);
    setDetailsError(null);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchNowPlaying(page);
    } else {
      fetchSearch(searchQuery, page);
    }
  }, [page, searchQuery])

  // once movies load, lock in one random movie as the hero (stays put afterwards)
  useEffect(() => {
    if (!heroMovie && movies.length > 0) {
      setHeroMovie(movies[Math.floor(Math.random() * movies.length)]);
    }
  }, [movies, heroMovie]);

  // toggle an id within a Set-valued state (used by both likes and watched)
  const toggleInSet = (setter) => (id) =>
    setter((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const handleToggleLike = toggleInSet(setLikes);
  const handleToggleWatched = toggleInSet(setWatched);

  // Library filter: "all" shows everything, the others narrow to liked/watched ids
  const filteredMovies = movies.filter((movie) => {
    if (view === "favorited") return likes.has(movie.id);
    if (view === "watched") return watched.has(movie.id);
    return true;
  });

  // apply the active sort (copy first so we don't mutate state); null keeps API order
  const visibleMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === "az") return (a.title ?? "").localeCompare(b.title ?? "");
    if (sortBy === "newest") return (b.release_date ?? "").localeCompare(a.release_date ?? "");
    if (sortBy === "rating") return (b.vote_average ?? 0) - (a.vote_average ?? 0);
    return 0;
  });

  const handleLoadMore = () => setPage((prev) => prev + 1);
  // both reset page to 1 so a mode switch starts a fresh list (page 1 replaces)
  // a search is a fresh dataset, so drop back to "All" — a stale favorites/watched filter would hide the results
  const handleSearch = (query) => { setSearchQuery(query); setPage(1); navigate("/"); };
  const handleNowPlaying = () => { setSearchQuery(""); setPage(1); navigate("/"); };

  return (
    <div className="App">
      <Header onSearch={handleSearch} onNowPlaying={handleNowPlaying} />
      <Hero movie={heroMovie} onOpen={(movie) => openMovie(movie.id)} />

      <main className="Main">
        <section className="rightMain">
          <SortControl sortBy={sortBy} onSortChange={setSortBy} />

          {view === "favorited" && visibleMovies.length === 0 ? (
            <p className="empty-view">No favorites yet. Tap the heart on any poster to add one</p>
          ) : view === "watched" && visibleMovies.length === 0 ? (
            <p className="empty-view">No watched titles yet. Mark something as watched to see it here</p>
          ) : searchQuery.trim() !== "" && visibleMovies.length === 0 && !isLoading ? (
            <p className="empty-view">No Movies found. Try a different search</p>
          ) : (
            <MovieList
              movies={visibleMovies}
              likes={likes}
              watched={watched}
              onToggleLike={handleToggleLike}
              onToggleWatched={handleToggleWatched}
              onCardClick={openMovie}
            />
          )}
          {error && <p className="error">{error}</p>}
          
          {(page < totalPages || isLoading) && (
            <button
              className="load-more"
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? "• LOADING… •" : "• SHOW MORE •"}
            </button>
          )}
        </section>
    </main>
    <Footer/>

    {selectedMovie && (
      <MovieModal
        movie={selectedMovie}
        isLoading={detailsLoading}
        error={detailsError}
        onClose={closeMovie}
      />
    )}
    </div>
  )
}

export default App
