import { useState } from 'react'
import './Library.css'

// the three filter views the library offers
const VIEWS = [
    { key: "all", label: "All Titles" },
    { key: "favorited", label: "Favorites" },
    { key: "watched", label: "Watched" },
]

const Library = ({ view, onViewChange }) => {
    // collapsed is local UI state — App doesn't care whether the panel is open
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="Library">
            <button
                className="library-toggle"
                aria-expanded={!collapsed}
                onClick={() => setCollapsed((prev) => !prev)}
            >
                Library {collapsed ? "[+]" : "[-]"}
            </button>

            {!collapsed && (
                <div className="library-options">
                    {VIEWS.map(({ key, label }) => (
                        <button
                            key={key}
                            className={view === key ? "library-option active" : "library-option"}
                            aria-pressed={view === key}
                            onClick={() => onViewChange(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Library
