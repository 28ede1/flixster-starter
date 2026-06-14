**Components**:
(define the responsibility, what it renders, what props it recieves, and whether it manages any state, and any parent-child relationship)

App:
The main purpose of the App component is to manage all other components of the website, which includes the header and search bar, the randomly chosen featured movie displayed, the list of movies that make up the main body of the page, the modal behavior, the sort functionality, and the footer. The app component manages all the aforementioned states necessary to render the main elements of the website dynamically. The App component should handle all API call behavior. 

Specifically, it should maintain:
A list of movie objects movies[]
A selected movie id selectedMovieId that is used to identify the movie used for the modal display. When null, no modal is open — so a separate "isModalOpen" boolean is not needed.
A featured movie featuredMovie (the randomly chosen movie shown at the top). Stored in state so it does not re-randomize on every render. Picked once after the movie list loads.
A search query searchQuery that is saved when the user hits enter
A sort option sortMode that determines how movies should be displayed
Props received: none (top-level component).
Parent-child: parent of Header, FeaturedMovie, MovieList, MovieModal, Footer. Passes state and handler callbacks down as props.

Header:
Main purpose is to display branding information and have a "now playing"
button to let the user go back to the main menu. Additionally, the header should display the search bar but need not actually manage it.
Renders: branding/logo, "Now Playing" button, and the SearchBar.
Props received: a callback to return to the now-playing view (e.g. onNowPlaying), plus whatever the SearchBar needs to pass through.
State: none of its own.
Parent-child: child of App, parent of SearchBar.

SearchBar:
Handles user search input. Should have a search bar display along with a clear button to clear the search bar. The searchQuery variable should save the result of the input.
Renders: a text input, a submit/search button, and a clear button.
Props received: onSearch(query) called when the user hits enter/submit; onClear called when the clear button is pressed.
State: local inputValue for the text currently being typed (controlled input). The committed searchQuery lives in App — only pushed up via onSearch on submit.
Parent-child: child of Header.

FeaturedMovie:
Displays a featured movie with a much larger backdrop. This should contain a randomly selected movie, with all of its information displayed. If the user clicks it, the movie modal should still pop up.
Renders: large backdrop image plus the movie's title, year, rating, and description.
Props received: featuredMovie (the movie object); onClick(movieId) to open the modal.
State: none — the random pick is owned by App.
Parent-child: child of App.


MovieList:
Displays the list of movie objects.
Renders: a grid/list of MovieCard components, one per movie.
Props received: movies[] (already filtered/sorted by App); onCardClick(movieId) to open the modal.
State: none — purely presentational.
Parent-child: child of App, parent of MovieCard (one per movie).

MovieCard:
Displays a card representing a movie. Should contain information about the title, rating, id, and should use the poster image. When hovered, the user should see the title appear as well as options to like/unlike a movie and mark it as watched/unwatched.
Renders: poster image; on hover, an overlay with the title, rating, and like/unlike + watched/unwatched buttons.
Props received: the movie object (title, rating, id, poster path); onClick(movieId) to open the modal; like/watched state and toggle callbacks.
State: none required if like/watched are lifted to App; may hold a local hover flag if not handled in CSS.
Parent-child: child of MovieList.


MovieModal:
Shows the full details of a single selected movie in an overlay. Opens when a card or the featured movie is clicked, closes on backdrop click or a close button.
Renders: backdrop image, title, tagline, year, rating, runtime, genres, description, and extra info (video/audio/HDR format, in-theaters status). A close button.
Props received: the selected movie's details; onClose callback. Conditionally rendered by App only when selectedMovieId is not null.
State: none of its own (it may trigger App's Movie Details fetch, or App fetches and passes details in).
Parent-child: child of App.

Footer:
Displays static site footer information (attribution, e.g. TMDb credit, copyright).
Renders: static text/links.
Props received: none.
State: none.
Parent-child: child of App.

SortControl:
Lets the user choose how the movie list is ordered (e.g. by title A-Z, rating, release date).
Renders: a dropdown or set of buttons for the available sort options.
Props received: current sortMode; onSortChange(mode) callback.
State: none — sortMode is owned by App, which re-sorts movies[] before passing to MovieList.
Parent-child: child of App (rendered near/above MovieList).

**TMDb endpoints**:
URL, required params, response fields components will use and error cases to handles

Auth: api_key passed on every request, kept in an env var (VITE_API_KEY) (gitignored).
Images: https://image.tmdb.org/t/p/w500/<poster_path> and https://image.tmdb.org/t/p/original/<backdrop_path>. Use a placeholder if the path is null (just use a blank gray background)

Now Playing Endpoint:
URL: https://api.themoviedb.org/3/movie/now_playing
Params: api_key, page (optional)
Fields used: results[] → id, title, poster_path, vote_average, release_date, overview, backdrop_path
Errors: network failure (try/catch), check response.ok, 401 bad key, 429 rate limit

Search Endpoint:
URL: https://api.themoviedb.org/3/search/movie
Params: api_key, query (URL-encoded, must be non-empty)
Fields used: same as Now Playing
Errors: 422 empty query, empty matches → results: [] (show "No movies found", not an error)

Movie Details Endpoint (needed for runtime and genre determination):
URL: https://api.themoviedb.org/3/movie/{movie_id}
Params: movie_id (in the path), api_key
Fields used: runtime, genres[].name, tagline (the modal-only data) + title, overview, vote_average, release_date, backdrop_path
Errors: 404 bad movie_id

Null poster/backdrop on any endpoint → use placeholder image.

Note: video quality, HDR, and audio format are NOT in the TMDb API — drop them or use static decorative labels.

**State Architecture**:
App owns all the shared state. SearchBar keeps its own typing state. Each line below says: what it is, what it starts as, and what changes it.

movies — an array of movie objects. Starts empty []. Updated when the Now Playing or Search fetch comes back.
searchQuery — a string for the submitted search. Starts as "". Updated when the user submits the search bar, cleared by the clear button.
page — a number for pagination. Starts at 1. Goes up on "load more", resets to 1 on a new search.
selectedMovieId — the id of the movie the modal is showing, or null. Starts null. Set when a card is clicked, set back to null when the modal closes.
movieDetails — the full details object for the modal, or null. Starts null. Updated when the Movie Details fetch comes back.
featuredMovie — the randomly chosen movie at the top, or null. Starts null. Set once after the first movie list loads.
sortMode — a string for how the list is sorted. Starts "default". Updated when the user changes the sort control.
isLoading — a boolean. Starts false. True while a fetch is happening, false when it finishes.
error — an error message string, or null. Starts null. Set when a fetch fails, cleared when the next fetch starts.
likes / watched — track which movies are liked or marked watched. Start empty. Toggled when the card buttons are clicked.

AI (owned by App, stored per movie id so the same movie isn't fetched twice):
aiDescriptions — the AI text for each movie. Starts empty {}. Set when an AI description comes back.
aiLoading — a boolean for the spinner. Starts false. True while the AI call runs.
aiError — an error string, or null. Starts null. Set if the AI call fails.

SearchBar (its own state): inputValue — the text being typed. Starts "". Updated as the user types; the final value is sent up to App when they hit submit.

**Data Flow**:
The App should call the TMDb API which fetches a list of movies (represented as movie objects in a list). The raw data gets cleaned up a bit so that attributes like posted or backdrop images can properly have URLs. The MovieList takes this raw data and loops over each movie object to render one card each.

When a card is clicked, the function (onClick in APP) should pass back up the movie id to the App component which uses it to fetch the specific movie details for the app that is used for showing the modal. 

**AI Feature Spec**:

The AI description should appear somewhere in the modal. The AI should return a 2-3 sentence description of the movie based on title, genre, overview, popularity (given by like count). There should be a loading status/flag show the modal can show a spinner, and an error string that should be printed. It is probably smarter if this API call lives in the App component so that the same API does not have to be called if its the same movie that is clicked on.