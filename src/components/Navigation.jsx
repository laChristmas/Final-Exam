import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navbar">
      <div className="nav-box">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
          alt="Logo" 
          className="nav-logo"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMTAiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';
          }}
        />
      </div>
      <Link to="/dashboard" className="nav-box nav-link">
        <span className="nav-text full-text">Dashboard</span>
        <span className="nav-text short-text">Dash</span>
      </Link>
      <Link to="/game/guessthenumber" className="nav-box nav-link">
        <span className="nav-text full-text">Guess The Number</span>
        <span className="nav-text short-text">Guess</span>
      </Link>
      <Link to="/game/tictactoe" className="nav-box nav-link">
        <span className="nav-text full-text">Tic Tac Toe</span>
        <span className="nav-text short-text">Tic</span>
      </Link>
      <Link to="/game/sealthebox" className="nav-box nav-link">
        <span className="nav-text full-text">Seal The Box</span>
        <span className="nav-text short-text">Seal</span>
      </Link>
    </nav>
  );
}

export default Navigation;

