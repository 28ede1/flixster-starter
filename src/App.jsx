import { useState, useEffect } from 'react'

import './App.css'
import MovieList from './MovieList'

const App = () => {
  const [movies, setMovieData] = useState([]); //we need a way to remember data between renders so we use useState
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchNowPlaying() {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      );

      if (!res.ok) {
        throw new Error(`TMDb error ${res.status}`);
      }

      const data = await res.json();
      setMovieData(data.results ?? []);
    } catch (err) {
      setError(err.message);
      setMovieData([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchNowPlaying();
  }, [])

  return (
    <div className="App">
      <MovieList movies={movies} />
    </div>
  )
}

export default App
