
import './SearchBar.css'

const SearchBar = () => {
    return (
        <div className="search-wrap">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </svg>

            <input type="search" placeholder="Search Titles" class="search-input"/>
        </div>
    )
}

export default SearchBar

