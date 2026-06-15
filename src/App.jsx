import { useState, useEffect } from 'react'

import './App.css'
import Header from './Header'
import MovieList from './MovieList'
import Library from './Library'

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
  const [view, setView] = useState("all"); // "all" | "favorited" | "watched"

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

  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchNowPlaying(page);
    } else {
      fetchSearch(searchQuery, page);
    }
  }, [page, searchQuery])

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
  const visibleMovies = movies.filter((movie) => {
    if (view === "favorited") return likes.has(movie.id);
    if (view === "watched") return watched.has(movie.id);
    return true;
  });

  const handleLoadMore = () => setPage((prev) => prev + 1);
  // both reset page to 1 so a mode switch starts a fresh list (page 1 replaces)
  const handleSearch = (query) => { setSearchQuery(query); setPage(1); };
  const handleNowPlaying = () => { setSearchQuery(""); setPage(1); };

  return (
    <div className="App">
      <Header onSearch={handleSearch} onNowPlaying={handleNowPlaying} />
      <Library view={view} onViewChange={setView} />
      {view === "favorited" && visibleMovies.length === 0 ? (
        <p className="empty-view">No favorites yet. Tap the heart on any poster to add one</p>
      ) : view === "watched" && visibleMovies.length === 0 ? (
        <p className="empty-view">No watched titles yet. Mark something as watched to see it here</p>
      ) : (
        <MovieList
          movies={visibleMovies}
          likes={likes}
          watched={watched}
          onToggleLike={handleToggleLike}
          onToggleWatched={handleToggleWatched}
        />
      )}
      {error && <p className="error">{error}</p>}
      
      {page < totalPages && (
        <button
          className="load-more"
          onClick={handleLoadMore}
          disabled={isLoading}
        >
          {isLoading ? "Loading…" : "Load More"}
        </button>
      )}

    </div>
  )
}

export default App
