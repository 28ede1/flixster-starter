import MovieCard from './MovieCard'
import './MovieList.css'

const MovieList = ({movies, likes, watched, onToggleLike, onToggleWatched, onCardClick}) => {
    return (
        <div className="MovieList">
            {movies.map((movie, index) => (
                // we use a key attribute because we need a way to
                // differentiate each card across re-renders, so React reuses, reorders, and removes the right DOM
                //  nodes when the movies array changes. movie.id is stable and unique, unlike the array index
                <MovieCard
                    key={movie.id}
                    movie_info={movie}
                    movie_number={index + 1}
                    liked={likes.has(movie.id)}
                    watched={watched.has(movie.id)}
                    onToggleLike={onToggleLike}
                    onToggleWatched={onToggleWatched}
                    onCardClick={onCardClick}
                />
            ))}
        </div>
    )
}

export default MovieList

