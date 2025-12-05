import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsButton from './StatsButton';
import './GuessTheNumber.css';

const GuessTheNumber = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState(null);
  const [targetNumber, setTargetNumber] = useState(null);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [guesses, setGuesses] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const difficultyConfig = {
    Easy: { min: 1, max: 10, time: 20 },
    Medium: { min: 1, max: 50, time: 30 },
    Hard: { min: 1, max: 100, time: 60 }
  };

  useEffect(() => {
    if (gameStarted && !gameEnded && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, gameEnded, timeRemaining]);

  const handleDifficultySelect = (level) => {
    const config = difficultyConfig[level];
    const randomNum = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
    setDifficulty(level);
    setTargetNumber(randomNum);
    setTimeRemaining(config.time);
    setGameStarted(true);
    startTimeRef.current = Date.now();
  };

  const handleTimeUp = () => {
    setGameEnded(true);
    setMessage(`Time's up! The correct number was ${targetNumber}.`);
    clearInterval(timerRef.current);
    
    // Update stats
    updateStats(false);
    
    // Redirect after 5 seconds
    setTimeout(() => {
      navigate('/game/guessthenumber');
    }, 5000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const guessNum = parseInt(guess, 10);
    const config = difficultyConfig[difficulty];

    // Validation
    if (isNaN(guessNum) || guessNum < config.min || guessNum > config.max) {
      setError(`Please enter a valid number between ${config.min} and ${config.max}`);
      return;
    }

    setGuesses(prev => prev + 1);

    if (guessNum === targetNumber) {
      // Win!
      setGameEnded(true);
      const finalTime = timeRemaining;
      setMessage(`Congratulations! You've guessed the number! The time left is ${finalTime} seconds`);
      clearInterval(timerRef.current);
      
      // Update stats
      updateStats(true, finalTime);
      
      // Trigger game win event for dashboard
      window.dispatchEvent(new CustomEvent('gameWin'));
      
      // Redirect after 5 seconds
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

  const updateStats = (won, timeLeft = 0) => {
    const statsKey = `guessTheNumber_${difficulty}`;
    const stats = JSON.parse(localStorage.getItem(statsKey) || '{"bestTime": 0, "correct": 0, "total": 0, "bestGuesses": Infinity}');
    
    stats.total += 1;
    
    if (won) {
      stats.correct += 1;
      // Best score is longest remaining time (highest timeLeft)
      if (timeLeft > stats.bestTime) {
        stats.bestTime = timeLeft;
      }
      // Best guesses (minimum number of guesses)
      if (guesses + 1 < stats.bestGuesses) {
        stats.bestGuesses = guesses + 1;
      }
    }
    
    localStorage.setItem(statsKey, JSON.stringify(stats));
    
    // Update game play stats
    const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{"guessTheNumber": {"plays": 0, "totalTime": 0}}');
    if (!gameStats.guessTheNumber) {
      gameStats.guessTheNumber = { plays: 0, totalTime: 0 };
    }
    gameStats.guessTheNumber.plays += 1;
    const timeSpent = difficultyConfig[difficulty].time - timeLeft;
    gameStats.guessTheNumber.totalTime += timeSpent;
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
  };

  if (!difficulty) {
    return (
      <div className="guess-the-number main-body">
        <StatsButton />
        <div className="difficulty-selection">
          <button onClick={() => handleDifficultySelect('Easy')} className="difficulty-button">
            Easy
          </button>
          <button onClick={() => handleDifficultySelect('Medium')} className="difficulty-button">
            Medium
          </button>
          <button onClick={() => handleDifficultySelect('Hard')} className="difficulty-button">
            Hard
          </button>
        </div>
      </div>
    );
  }

  const config = difficultyConfig[difficulty];

  return (
    <div className="guess-the-number main-body">
      <StatsButton />
      <div className="game-container">
        <p className="game-instruction">
          I have selected a number between {config.min} and {config.max}. Can you guess it?
        </p>
        <div className="time-display">
          Time remaining: {timeRemaining} seconds
        </div>
        {error && <div className="error-message">{error}</div>}
        {message && <div className={`game-message ${gameEnded ? 'end-message' : ''}`}>{message}</div>}
        {!gameEnded && (
          <form onSubmit={handleSubmit} className="guess-form">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="guess-input"
              placeholder="Enter your guess"
              min={config.min}
              max={config.max}
            />
            <button type="submit" className="submit-button">
              Submit Guess
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default GuessTheNumber;

