import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1400);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1400);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-box">
        <img 
          src="https://via.placeholder.com/20x20/fff/000?text=G" 
          alt="Logo" 
          className="nav-logo"
        />
      </div>
      <Link to="/dashboard" className="nav-box">
        <span className="nav-text">{isSmallScreen ? 'Dash' : 'Dashboard'}</span>
      </Link>
      <Link to="/game/guessthenumber" className="nav-box">
        <span className="nav-text">{isSmallScreen ? 'Guess' : 'Guess The Number'}</span>
      </Link>
      <Link to="/game/tictactoe" className="nav-box">
        <span className="nav-text">{isSmallScreen ? 'Tic' : 'Tic Tac Toe'}</span>
      </Link>
      <Link to="/game/sealthebox" className="nav-box">
        <span className="nav-text">{isSmallScreen ? 'Seal' : 'Seal The Box'}</span>
      </Link>
    </nav>
  );
}

export default Navbar;

