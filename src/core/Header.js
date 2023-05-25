import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header>
            <nav className="navbar navbar-expand-md navbar-dark">
                <a className="navbar-brand">&nbsp; Games AI</a>
                <div className="navbar-nav">
                    <Link to="/">
                        <a className="nav-item nav-link">About</a>
                    </Link>
                    <Link to="/cannon">
                        <a className="nav-item nav-link">Cannon</a>
                    </Link>
                    <a className="nav-item nav-link" href="https://github.com/cant12/games-ai-UI">Github</a>
                </div>
            </nav>
        </header>
    );
}