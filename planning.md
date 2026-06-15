**Components**:
(define the responsibility, what it renders, what props it recieves, and whether it manages any state, and any parent-child relationship)

App:
The main purpose of the App component is to manage all other components of the website, which includes the header and search bar, the randomly chosen featured movie displayed, the list of movies that make up the main body of the page, the modal behavior, the sort functionality, and the footer. The app component manages all the aforementioned states necessary to render the main elements of the website dynamically. The App component should handle all API call behavior. 


Specifically, it should maintain:
A list of movie objects movies (its setter is named setMovieData)
A selected movie id selectedMovieId that is used to identify the movie used for the modal display. When null, no modal is open — so a separate "isModalOpen" boolean is not needed.
A featured movie featuredMovie (the randomly chosen movie shown at the top). Stored in state so it does not re-randomize on every render. Picked once after the movie list loads.
A search query searchQuery that is saved when the user hits enter
A sort option sortMode that determines how movies should be displayed
Props received: none (top-level component).
Parent-child: parent of Header, FeaturedMovie, MovieList, MovieModal, Footer. Passes state and handler callbacks down as props.
page — a number for pagination. Starts at 1. Goes up on "load more", resets to 1 on a new search. Should be controlled by App component

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
Props received: onSearch(query) called when the user hits enter/submit. The clear button reuses the same callback by calling onSearch("") (an empty query sends App back to Now Playing), so no separate onClear prop is needed.
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
Props received: movies (already filtered by App); the likes and watched id Sets; onToggleLike and onToggleWatched callbacks. (A future onCardClick(movieId) would be added here to open the modal.)
State: none — purely presentational. Passes movie (as movie_info) and the 1-based movie_number index down to each MovieCard.
Parent-child: child of App, parent of MovieCard (one per movie).

MovieCard:
Displays a card representing a movie. Should contain information about the title, rating, id, and should use the poster image. When hovered, the user should see the title appear as well as options to like/unlike a movie and mark it as watched/unwatched.
Renders: poster image; on hover, an overlay with the title, rating, and like/unlike + watched/unwatched buttons.
Props received: movie_info (the movie object: title, vote_average, id, poster_path, release_date); movie_number (its 1-based position, rendered as a zero-padded tag); the liked and watched booleans; onToggleLike(id) and onToggleWatched(id) callbacks. (A future onClick(movieId) would open the modal.)
State: none — liked/watched are lifted to App (tracked there as Sets of ids); hover is handled in CSS.
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

Library: 
This component should be a small section of the screen that has a button to collapse it. It should have 3 options that allow the user to either 1) view all titles, 2) view favorited, 3) view watched movies.
Props received: the current view string ("all" | "favorited" | "watched") and an onViewChange(key) callback. App owns view and filters movies into visibleMovies based on it.
State: a local collapsed boolean for whether the panel is open (App doesn't track this).

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

**OpenRouter endpoint**

URL:https://openrouter.ai/api/v1/chat/completions
model: openrouter/auto

**State Architecture**:
App owns all the shared state. SearchBar keeps its own typing state. Each line below says: what it is, what it starts as, and what changes it.

movies — an array of movie objects (setter setMovieData). Starts empty []. Updated when the Now Playing or Search fetch comes back.
searchQuery — a string for the submitted search. Starts as "". Updated when the user submits the search bar, cleared by the clear button.
page — a number for pagination. Starts at 1. Goes up on "load more", resets to 1 on a new search. Should be controlled by App component
selectedMovieId — the id of the movie the modal is showing, or null. Starts null. Set when a card is clicked, set back to null when the modal closes.
movieDetails — the full details object for the modal, or null. Starts null. Updated when the Movie Details fetch comes back.
featuredMovie — the randomly chosen movie at the top, or null. Starts null. Set once after the first movie list loads.
sortMode — a string for how the list is sorted. Starts "default". Updated when the user changes the sort control.
isLoading — a boolean. Starts false. True while a fetch is happening, false when it finishes.
error — an error message string, or null. Starts null. Set when a fetch fails, cleared when the next fetch starts.
likes / watched — Sets of movie ids that are liked or marked watched. Start empty (new Set()). Toggled via handleToggleLike / handleToggleWatched when the card buttons are clicked.
view — the Library filter string ("all" | "favorited" | "watched"). Starts "all". Updated via onViewChange; App derives visibleMovies from it before passing to MovieList.
totalPages — the total number of result pages reported by TMDb (setter setTotalPages). Starts 1. Used to hide the "Load More" button once page reaches it.

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


**IMPLEMENTATION DECISIONS**

1) Started by scoping out what the project should look like, what features were required, what components I would need to make and the how my code would have those components organized, what API endpoints 
I would use, and jotted down everything in the planning document. Used lovable to help me scaffold a project that looked like how I wanted it to for reference. 

2) Wrote API fetch function and tested it out in console to understand the structure of the data and how I would use that structure to help build any necessary components.

3) Wrote MovieCard and defined variables needed based on the mockup

4) Wrote MovieList component to take movie data and render all the MovieCards needed. Implement CSS styling using flex-grid + flex-box combination to have a grid of 6 movie cards max per row.

5) When implementing "load more" button, I was prompted to make two design choices:

    1) When the user hits the "load more" button and it fails, it should not remove the movie cards already there.

    2) The button should probably hide when when no more pages are present.

A "page" variable keeps track of what page of results you are asking TMDb for (starts at 1 because you
want page 1 returned). Eventually we want to know when to stop showing the "show more" button (for user sake) so
we keep track of a totalPages variable as well.

To change the variables, we have a setPage and setTotalPages accompanying function. 

"handleLoadMore" updates the page count (page = page + 1)

the useEffect function has a call to fetchNowPlaying (which originally just got the first page of results) and now basically says that if "page" changes, this function should run again.

because the fetch request only gets 20 pages at a time, we need a way to still have the older pages there after 
you make a call to load more pages. 

the "setMovieData" basically says: if pageToFetch is 1, replace the entire list, else append the data results 
to the current list of movies ([...prev,...results] does this)

lastly we make sure to save the total number of pages that TMDb has in the variable so that
we can hide the loadmore button if the page count is exceeded.

There is a disabled state, that based on if disabled or not, displays different text and allows/does not allow user to click the button.

6) Implement basic header information (including the SearchBar component)

7) Implement search functionality, using similar design pattern to handling fetch requests for "Now Playing"

8) Implement sorting options for liked/unliked and watched/unwatched

9) Add footer section