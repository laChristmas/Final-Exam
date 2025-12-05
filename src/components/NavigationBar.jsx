import { Link, useLocation } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-box">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" 
          alt="Logo" 
          className="nav-logo"
        />
      </div>
      <Link to="/dashboard" className={`nav-box ${isActive('/dashboard') ? 'active' : ''}`}>
        <span className="nav-text">
          <span className="full-text">Dashboard</span>
          <span className="short-text">Dash</span>
        </span>
      </Link>
      <Link to="/game/guessthenumber" className={`nav-box ${isActive('/game/guessthenumber') ? 'active' : ''}`}>
        <span className="nav-text">
          <span className="full-text">Guess The Number</span>
          <span className="short-text">Guess</span>
        </span>
      </Link>
      <Link to="/game/tictactoe" className={`nav-box ${isActive('/game/tictactoe') ? 'active' : ''}`}>
        <span className="nav-text">
          <span className="full-text">Tic Tac Toe</span>
          <span className="short-text">Tic</span>
        </span>
      </Link>
      <Link to="/game/sealthebox" className={`nav-box ${isActive('/game/sealthebox') ? 'active' : ''}`}>
        <span className="nav-text">
          <span className="full-text">Seal The Box</span>
          <span className="short-text">Seal</span>
        </span>
      </Link>
    </nav>
  );
};

export default NavigationBar;

