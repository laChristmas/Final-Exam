import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [gamesToWin, setGamesToWin] = useState(null);
  const [initialScore, setInitialScore] = useState(null);

  useEffect(() => {
    // Load from localStorage first
    const storedScore = localStorage.getItem('gamesToWin');
    const storedInitial = localStorage.getItem('initialScore');
    
    if (storedScore !== null && storedInitial !== null) {
      setGamesToWin(parseInt(storedScore, 10));
      setInitialScore(parseInt(storedInitial, 10));
    } else {
      // Fetch from URL
      fetch('https://cgi.cse.unsw.edu.au/~cs6080/raw/data/score.json')
        .then(response => response.json())
        .then(data => {
          const score = data.score;
          setInitialScore(score);
          setGamesToWin(score);
          localStorage.setItem('gamesToWin', score.toString());
          localStorage.setItem('initialScore', score.toString());
        })
        .catch(error => {
          console.error('Error fetching score:', error);
          // Fallback value
          const fallback = 5;
          setInitialScore(fallback);
          setGamesToWin(fallback);
          localStorage.setItem('gamesToWin', fallback.toString());
          localStorage.setItem('initialScore', fallback.toString());
        });
    }

    // Listen for game win events
    const handleGameWin = () => {
      setGamesToWin(prev => {
        if (prev === null) return null;
        const newScore = Math.max(0, prev - 1);
        localStorage.setItem('gamesToWin', newScore.toString());
        
        if (newScore === 0) {
          setTimeout(() => {
            alert('Congratulations!');
            const initial = parseInt(localStorage.getItem('initialScore'), 10);
            setGamesToWin(initial);
            localStorage.setItem('gamesToWin', initial.toString());
          }, 100);
        }
        
        return newScore;
      });
    };

    window.addEventListener('gameWin', handleGameWin);
    return () => window.removeEventListener('gameWin', handleGameWin);
  }, []);

  const handleReset = async () => {
    let scoreToUse = initialScore;
    if (scoreToUse === null) {
      try {
        const response = await fetch('https://cgi.cse.unsw.edu.au/~cs6080/raw/data/score.json');
        const data = await response.json();
        scoreToUse = data.score;
        setInitialScore(scoreToUse);
        localStorage.setItem('initialScore', scoreToUse.toString());
      } catch (error) {
        scoreToUse = 5;
      }
    }
    setGamesToWin(scoreToUse);
    localStorage.setItem('gamesToWin', scoreToUse.toString());
  };

  if (gamesToWin === null) {
    return (
      <div className="main-body dashboard">
        <div className="dashboard-content">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-body dashboard">
      <div className="dashboard-content">
        <p className="dashboard-line">Choose your option from the navbar.</p>
        <p className="dashboard-line">Games you need to win: {gamesToWin}</p>
        <button className="reset-button" onClick={handleReset}>Reset</button>
      </div>
      <Link to="/statspanel" className="stats-button">Stats</Link>
    </div>
  );
}

export default Dashboard;

