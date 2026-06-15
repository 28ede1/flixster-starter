import SearchBar from "./SearchBar"
import Library from "./Library"
import './Header.css'

const Header = ({ onSearch, onNowPlaying }) => {
    return (
        <div className="Header">
            <div className="Left-Header">
                <Library />
                <button className="fx-logo" onClick={onNowPlaying} aria-label="Home">FX</button>
                <span className="brand-name"> Flixter </span>
            </div>

            <SearchBar onSearch={onSearch} />


        </div>
    )
}

export default Header

