import SearchBar from "./SearchBar"

const Header = () => {
    return (
        <div className="Header">
            <span> FX </span>
            <span> Flixter </span>
            <span> | </span>
            <span> Now Playing </span>

            <SearchBar/>

            
        </div>
    )
}

export default Header

