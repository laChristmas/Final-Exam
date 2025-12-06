import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGamesToWin, setGamesToWin } from '../utils/storage';
import StatsButton from './StatsButton';
import './Dashboard.css';

function Dashboard() {
  const [gamesToWin, setGamesToWinState] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialScore = async () => {
      try {
        const response = await fetch('https://cgi.cse.unsw.edu.au/~cs6080/raw/data/score.json');
        const data = await response.json();
        const initialScore = data.score;
        
        const stored = getGamesToWin();
        if (stored === null) {
          setGamesToWin(initialScore);
          setGamesToWinState(initialScore);
        } else {
          setGamesToWinState(stored);
        }
      } catch (error) {
        console.error('Error fetching initial score:', error);
        const stored = getGamesToWin();
        if (stored === null) {
          setGamesToWin(5);
          setGamesToWinState(5);
        } else {
          setGamesToWinState(stored);
        }
      }
    };

    fetchInitialScore();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === 'gamesToWin') {
        setGamesToWinState(parseInt(e.newValue, 10));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (gamesToWin === 0) {
      alert('Congratulations!');
      const fetchAndReset = async () => {
        try {
          const response = await fetch('https://cgi.cse.unsw.edu.au/~cs6080/raw/data/score.json');
          const data = await response.json();
          const initialScore = data.score;
          setGamesToWin(initialScore);
          setGamesToWinState(initialScore);
        } catch (error) {
          setGamesToWin(5);
          setGamesToWinState(5);
        }
      };
      fetchAndReset();
    }
  }, [gamesToWin]);

  const handleReset = async () => {
    try {
      const response = await fetch('https://cgi.cse.unsw.edu.au/~cs6080/raw/data/score.json');
      const data = await response.json();
      const initialScore = data.score;
      setGamesToWin(initialScore);
      setGamesToWinState(initialScore);
    } catch (error) {
      setGamesToWin(5);
      setGamesToWinState(5);
    }
  };

  if (gamesToWin === null) {
    return <div className="main-body">Loading...</div>;
  }

  return (
    <div className="main-body dashboard">
      <StatsButton />
      <div className="dashboard-content">
        <div className="dashboard-text">
          Choose your option from the navbar.
        </div>
        <div className="dashboard-text">
          Games you need to win: {gamesToWin}
        </div>
        <button className="reset-button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default Dashboard;

