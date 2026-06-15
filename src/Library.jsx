import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import './Library.css'

// the three filter views, each a route the sidebar links to
const VIEWS = [
    { to: "/", label: "All Titles", end: true },
    { to: "/favorites", label: "Favorites" },
    { to: "/watched", label: "Watched" },
]

const Library = () => {
    // open is local UI state — the active view lives in the URL, not here
    const [open, setOpen] = useState(false);

    // lock body scroll + close on Escape while the drawer is open
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <>
            <button
                className="library-toggle"
                aria-label="Open library menu"
                aria-expanded={open}
                onClick={() => setOpen(true)}
            >
                <span className="hamburger-icon" aria-hidden="true">☰</span>
            </button>

            {/* dimmed backdrop — click anywhere off the drawer to close */}
            <div
                className={open ? "library-overlay is-open" : "library-overlay"}
                onClick={() => setOpen(false)}
            />

            {/* slide-in sidebar from the left */}
            <aside className={open ? "library-drawer is-open" : "library-drawer"}>
                <div className="library-drawer-head">
                    <span className="library-drawer-title">Library</span>
                    <button
                        className="library-close"
                        aria-label="Close library menu"
                        onClick={() => setOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                <nav className="library-options">
                    {VIEWS.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                isActive ? "library-option active" : "library-option"}
                            onClick={() => setOpen(false)}
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    )
}

export default Library
