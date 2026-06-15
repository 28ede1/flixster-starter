import SearchBar from "./SearchBar"
import './Header.css'

const Header = ({ onSearch, onNowPlaying }) => {
    return (
        <div className="Header">
            <div className="Left-Header">
                <span className="fx-logo">FX</span>
                <span> Flixter </span>
                <span> | </span>
                <button className="now-playing-btn" onClick={onNowPlaying}> Now Playing </button>
            </div>
            
            <SearchBar onSearch={onSearch} />

            
        </div>
    )
}

export default Header

