const Footer = () => {
  return (
      <div className="footer-inner">
          <p>© {new Date().getFullYear()} · Flixster · By Emmanuel Ekpenyong</p>
          <p>
            Source ·{" "}
            <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
              The Movie Database
            </a>
          </p>
      </div>
  );
}

export default Footer
