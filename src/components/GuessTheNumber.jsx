import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './GuessTheNumber.css';

function GuessTheNumber() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState(null);
  const [targetNumber, setTargetNumber] = useState(null);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [guessCount, setGuessCount] = useState(0);
  const timerRef = useRef(null);

  const difficulties = {
    Easy: { min: 1, max: 10, time: 20 },
    Medium: { min: 1, max: 50, time: 30 },
    Hard: { min: 1, max: 100, time: 60 }
  };

  useEffect(() => {
    if (difficulty && timeLeft !== null && timeLeft > 0 && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [difficulty, timeLeft, gameOver]);

  const handleDifficultySelect = (level) => {
    const config = difficulties[level];
    const number = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
    setDifficulty(level);
    setTargetNumber(number);
    setTimeLeft(config.time);
    setGameStartTime(Date.now());
    setGameOver(false);
    setMessage('');
    setError('');
    setGuess('');
    setGuessCount(0);
    
    // Track game start
    const stats = JSON.parse(localStorage.getItem('guessTheNumberStats') || '{}');
    if (!stats[level]) {
      stats[level] = { total: 0, wins: 0, bestTime: null, bestGuesses: null };
    }
    stats[level].total = (stats[level].total || 0) + 1;
    localStorage.setItem('guessTheNumberStats', JSON.stringify(stats));
    
    // Track game play time
    const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
    if (!gameStats.guessTheNumber) {
      gameStats.guessTheNumber = { plays: 0, totalTime: 0 };
    }
    gameStats.guessTheNumber.plays = (gameStats.guessTheNumber.plays || 0) + 1;
    gameStats.guessTheNumber.startTime = Date.now();
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
  };

  const handleTimeUp = () => {
    setGameOver(true);
    setMessage(`Time's up! The correct number was ${targetNumber}.`);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Track game end time
    const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
    if (gameStats.guessTheNumber && gameStats.guessTheNumber.startTime) {
      const timeSpent = (Date.now() - gameStats.guessTheNumber.startTime) / 1000;
      gameStats.guessTheNumber.totalTime = (gameStats.guessTheNumber.totalTime || 0) + timeSpent;
      delete gameStats.guessTheNumber.startTime;
      localStorage.setItem('gameStats', JSON.stringify(gameStats));
    }
    
    setTimeout(() => {
      navigate('/game/guessthenumber');
    }, 5000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (gameOver) return;

    const config = difficulties[difficulty];
    const guessNum = parseInt(guess, 10);

    if (isNaN(guessNum) || guessNum < config.min || guessNum > config.max) {
      setError(`Please enter a valid number between ${config.min} and ${config.max}`);
      return;
    }

    setGuessCount(prev => prev + 1);

    if (guessNum === targetNumber) {
      setGameOver(true);
      const remainingTime = timeLeft;
      setMessage(`Congratulations! You've guessed the number! The time left is ${remainingTime} seconds`);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Update stats
      const stats = JSON.parse(localStorage.getItem('guessTheNumberStats') || '{}');
      if (!stats[difficulty]) {
        stats[difficulty] = { total: 0, wins: 0, bestTime: null, bestGuesses: null };
      }
      stats[difficulty].wins = (stats[difficulty].wins || 0) + 1;
      
      // Update best score (longest remaining time)
      if (stats[difficulty].bestTime === null || remainingTime > stats[difficulty].bestTime) {
        stats[difficulty].bestTime = remainingTime;
      }
      
      // Update best guesses (minimum guesses)
      if (stats[difficulty].bestGuesses === null || guessCount + 1 < stats[difficulty].bestGuesses) {
        stats[difficulty].bestGuesses = guessCount + 1;
      }
      
      localStorage.setItem('guessTheNumberStats', JSON.stringify(stats));
      
      // Track game end time
      const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
      if (gameStats.guessTheNumber && gameStats.guessTheNumber.startTime) {
        const timeSpent = (Date.now() - gameStats.guessTheNumber.startTime) / 1000;
        gameStats.guessTheNumber.totalTime = (gameStats.guessTheNumber.totalTime || 0) + timeSpent;
        delete gameStats.guessTheNumber.startTime;
        localStorage.setItem('gameStats', JSON.stringify(gameStats));
      }
      
      // Trigger game win event
      window.dispatchEvent(new Event('gameWin'));
      
      setTimeout(() => {
        navigate('/game/guessthenumber');
      }, 5000);
    } else if (guessNum < targetNumber) {
      setMessage('Too low! Try again.');
    } else {
      setMessage('Too high! Try again.');
    }

    setGuess('');
  };

  if (!difficulty) {
    return (
      <div className="main-body guess-the-number">
        <div className="difficulty-selection">
          <button onClick={() => handleDifficultySelect('Easy')}>Easy</button>
          <button onClick={() => handleDifficultySelect('Medium')}>Medium</button>
          <button onClick={() => handleDifficultySelect('Hard')}>Hard</button>
        </div>
        <Link to="/statspanel" className="stats-button">Stats</Link>
      </div>
    );
  }

  return (
    <div className="main-body guess-the-number">
      <div className="game-content">
        <p className="game-message">
          I have selected a number between {difficulties[difficulty].min} and {difficulties[difficulty].max}. Can you guess it?
        </p>
        <p className="time-display">Time remaining: {timeLeft} seconds</p>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="feedback-message">{message}</p>}
        {!gameOver && (
          <form onSubmit={handleSubmit} className="guess-form">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="guess-input"
              min={difficulties[difficulty].min}
              max={difficulties[difficulty].max}
            />
            <button type="submit" className="submit-button">Submit Guess</button>
          </form>
        )}
      </div>
      <Link to="/statspanel" className="stats-button">Stats</Link>
    </div>
  );
}

export default GuessTheNumber;

