import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateGuessTheNumberStats, addGamePlayTime } from '../utils/storage';
import { getGamesToWin, setGamesToWin } from '../utils/storage';
import StatsButton from './StatsButton';
import './GuessTheNumber.css';

function GuessTheNumber() {
  const [difficulty, setDifficulty] = useState(null);
  const [targetNumber, setTargetNumber] = useState(null);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [guesses, setGuesses] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const difficultyConfig = {
    easy: { min: 1, max: 10, time: 20 },
    medium: { min: 1, max: 50, time: 30 },
    hard: { min: 1, max: 100, time: 60 }
  };

  useEffect(() => {
    if (gameStarted && timeRemaining > 0 && !gameEnded) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
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
  }, [gameStarted, gameEnded]);

  const handleDifficultySelect = (level) => {
    const config = difficultyConfig[level];
    const randomNumber = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
    setDifficulty(level);
    setTargetNumber(randomNumber);
    setTimeRemaining(config.time);
    setGameStarted(true);
    setStartTime(Date.now());
  };

  const handleTimeUp = () => {
    setGameEnded(true);
    setMessage(`Time's up! The correct number was ${targetNumber}.`);
    const config = difficultyConfig[difficulty];
    updateGuessTheNumberStats(difficulty, 0, false);
    
    const playTime = difficultyConfig[difficulty].time;
    addGamePlayTime('guessTheNumber', playTime);
    
    setTimeout(() => {
      navigate('/game/guessthenumber');
    }, 5000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gameEnded) return;

    const numGuess = parseInt(guess, 10);
    const config = difficultyConfig[difficulty];

    // Validation
    if (isNaN(numGuess) || numGuess < config.min || numGuess > config.max) {
      setMessage(`Please enter a valid number between ${config.min} and ${config.max}`);
      return;
    }

    // Clear error message if input is valid
    if (message.includes('Please enter a valid number')) {
      setMessage('');
    }

    setGuesses(guesses + 1);

    if (numGuess === targetNumber) {
      setGameEnded(true);
      const playTime = (Date.now() - startTime) / 1000;
      addGamePlayTime('guessTheNumber', playTime);
      updateGuessTheNumberStats(difficulty, timeRemaining, true);
      setMessage(`Congratulations! You've guessed the number! The time left is ${timeRemaining} seconds`);
      
      // Update games to win
      const current = getGamesToWin();
      if (current > 0) {
        setGamesToWin(current - 1);
        window.dispatchEvent(new Event('storage'));
      }

      setTimeout(() => {
        navigate('/game/guessthenumber');
      }, 5000);
    } else if (numGuess < targetNumber) {
      setMessage('Too low! Try again.');
    } else {
      setMessage('Too high! Try again.');
    }

    setGuess('');
  };

  if (!difficulty) {
    return (
      <div className="main-body guess-number">
        <StatsButton />
        <div className="difficulty-selection">
          <button onClick={() => handleDifficultySelect('easy')} className="difficulty-button">
            Easy
          </button>
          <button onClick={() => handleDifficultySelect('medium')} className="difficulty-button">
            Medium
          </button>
          <button onClick={() => handleDifficultySelect('hard')} className="difficulty-button">
            Hard
          </button>
        </div>
      </div>
    );
  }

  const config = difficultyConfig[difficulty];

  return (
    <div className="main-body guess-number">
      <StatsButton />
      <div className="game-container">
        <div className="game-message">
          I have selected a number between {config.min} and {config.max}. Can you guess it?
        </div>
        <div className="time-display">
          Time remaining: {timeRemaining} seconds
        </div>
        {message && (
          <div className={`message ${message.includes('valid') ? 'error' : 'info'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="guess-form">
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess"
            className="guess-input"
            disabled={gameEnded}
          />
          <button type="submit" className="submit-button" disabled={gameEnded}>
            Submit Guess
          </button>
        </form>
      </div>
    </div>
  );
}

export default GuessTheNumber;

