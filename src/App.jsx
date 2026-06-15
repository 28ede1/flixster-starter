import { useState, useEffect } from 'react'

import './App.css'
import Header from './Header'
import MovieList from './MovieList'

const App = () => {
  const [movies, setMovieData] = useState([]); //we need a way to remember data between renders so we use useState
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleLoadMore = () => setPage((prev) => prev + 1);
  // both reset page to 1 so a mode switch starts a fresh list (page 1 replaces)
  const handleSearch = (query) => { setSearchQuery(query); setPage(1); };
  const handleNowPlaying = () => { setSearchQuery(""); setPage(1); };

  return (
    <div className="App">
      <Header onSearch={handleSearch} onNowPlaying={handleNowPlaying} />
      <MovieList movies={movies} />
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
