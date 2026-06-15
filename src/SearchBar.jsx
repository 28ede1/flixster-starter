import { useState, useEffect } from 'react'
import './SearchBar.css'

const SearchBar = ({onSearch}) => {
    const [inputValue, setInputValue] = useState("");
    
    const handleSubmit = (e) => {
        e.preventDefault();              // stop the page reload
        onSearch(inputValue.trim());     // push the committed query up to App
    };

    // claude decided to always send out a value to the parent even if its empty (this is helpful for passing the edge case where the user
    // should be directed to the home page if the dont type anything)
    const handleClear = () => {
        setInputValue("");               // clear the local text box
        onSearch("");                    // empty query => App goes back to Now Playing
    };

    return (
        <form className="search-wrap" onSubmit={handleSubmit}>
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </svg>

            <input
                type="text"
                placeholder="Search Titles"
                className="search-input"
                value={inputValue}                                 // controlled
                onChange={(e) => setInputValue(e.target.value)}
            />

            {/* if inputValue is empty react renders nothing; else react renders the x button */}
            {inputValue && (
                <button type="button" className="search-clear" onClick={handleClear}>
                    ✕
                </button>
            )}
        </form>
    )
}

export default SearchBar

