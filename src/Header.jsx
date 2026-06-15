import SearchBar from "./SearchBar"
import './Header.css'

const Header = ({ onSearch, onNowPlaying }) => {
    return (
        <div className="Header">
            <span> FX </span>
            <span> Flixter </span>
            <span> | </span>
            <button className="now-playing-btn" onClick={onNowPlaying}> Now Playing </button>

            <SearchBar onSearch={onSearch} />

            
        </div>
    )
}

export default Header

