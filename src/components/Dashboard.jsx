import { useState, useEffect } from 'react';
import StatsButton from './StatsButton';
import './Dashboard.css';

const Dashboard = () => {
  const [gamesToWin, setGamesToWin] = useState(null);
  const [initialScore, setInitialScore] = useState(null);

  useEffect(() => {
    // Fetch initial score from API
    const fetchInitialScore = async () => {
      try {
        const response = await fetch('https://cgi.cse.unsw.edu.au/~cs6080/raw/data/score.json');
        const data = await response.json();
        const score = data.score;
        setInitialScore(score);
        
        // Check localStorage for existing score
        const storedScore = localStorage.getItem('gamesToWin');
        if (storedScore !== null) {
          const parsedScore = parseInt(storedScore, 10);
          setGamesToWin(parsedScore);
          
          // Check if score reached 0 and show alert
          if (parsedScore === 0) {
            alert('Congratulations!');
            // Reset to initial value
            localStorage.setItem('gamesToWin', score.toString());
            setGamesToWin(score);
          }
        } else {
          // First time, set to initial score
          localStorage.setItem('gamesToWin', score.toString());
          setGamesToWin(score);
        }
      } catch (error) {
        console.error('Error fetching initial score:', error);
        // Fallback to 5 if API fails
        const fallbackScore = 5;
        setInitialScore(fallbackScore);
        const storedScore = localStorage.getItem('gamesToWin');
        if (storedScore !== null) {
          setGamesToWin(parseInt(storedScore, 10));
        } else {
          localStorage.setItem('gamesToWin', fallbackScore.toString());
          setGamesToWin(fallbackScore);
        }
      }
    };

    fetchInitialScore();
  }, []);

  // Listen for game win events
  useEffect(() => {
    const handleGameWin = () => {
      const currentScore = parseInt(localStorage.getItem('gamesToWin'), 10);
      if (currentScore > 0) {
        const newScore = currentScore - 1;
        localStorage.setItem('gamesToWin', newScore.toString());
        setGamesToWin(newScore);
        
        if (newScore === 0) {
          setTimeout(() => {
            alert('Congratulations!');
            // Reset to initial value
            if (initialScore !== null) {
              localStorage.setItem('gamesToWin', initialScore.toString());
              setGamesToWin(initialScore);
            }
          }, 100);
        }
      }
    };

    window.addEventListener('gameWin', handleGameWin);
    return () => window.removeEventListener('gameWin', handleGameWin);
  }, [initialScore]);

  const handleReset = async () => {
    if (initialScore !== null) {
      localStorage.setItem('gamesToWin', initialScore.toString());
      setGamesToWin(initialScore);
    } else {
      // Fetch again if initialScore is not set
      try {
        const response = await fetch('https://cgi.cse.unsw.edu.au/~cs6080/raw/data/score.json');
        const data = await response.json();
        const score = data.score;
        localStorage.setItem('gamesToWin', score.toString());
        setGamesToWin(score);
        setInitialScore(score);
      } catch (error) {
        console.error('Error fetching initial score:', error);
      }
    }
  };

  return (
    <div className="dashboard main-body">
      <StatsButton />
      <div className="dashboard-content">
        <div className="dashboard-line">
          Choose your option from the navbar.
        </div>
        <div className="dashboard-line">
          Games you need to win: {gamesToWin !== null ? gamesToWin : 'Loading...'}
        </div>
        <button className="reset-button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

