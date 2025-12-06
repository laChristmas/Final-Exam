import { useState, useEffect, useRef } from 'react';
import { updateTicTacToeStats, addGamePlayTime } from '../utils/storage';
import { getGamesToWin, setGamesToWin } from '../utils/storage';
import StatsButton from './StatsButton';
import './TicTacToe.css';

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 = O, 2 = X
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [moves, setMoves] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const animationRef = useRef(null);

  useEffect(() => {
    if (gameOver && !animating) {
      setAnimating(true);
      let count = 0;
      const interval = setInterval(() => {
        count++;
        if (count >= 6) {
          clearInterval(interval);
          setAnimating(false);
          setShowOverlay(true);
          const playTime = (Date.now() - startTime) / 1000;
          addGamePlayTime('ticTacToe', playTime);
        }
      }, 500);
      animationRef.current = interval;
      return () => clearInterval(interval);
    }
  }, [gameOver, animating]);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleCellClick = (index) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer === 1 ? 'O' : 'X';
    setBoard(newBoard);
    setMoves(moves + 1);

    const winner = checkWinner(newBoard);
    if (winner) {
      setWinner(winner);
      setGameOver(true);
      if (winner === 'O') {
        updateTicTacToeStats('O');
        const current = getGamesToWin();
        if (current > 0) {
          setGamesToWin(current - 1);
          window.dispatchEvent(new Event('storage'));
        }
      } else {
        updateTicTacToeStats('X');
      }
    } else if (moves + 1 === 9) {
      setGameOver(true);
      updateTicTacToeStats(null);
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const handlePlayAgain = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(1);
    setGameOver(false);
    setWinner(null);
    setMoves(0);
    setShowOverlay(false);
    setAnimating(false);
    setStartTime(Date.now());
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }
  };

  return (
    <div className="main-body tic-tac-toe">
      <StatsButton />
      <div className={`board ${animating ? 'animating' : ''} ${currentPlayer === 1 ? 'player1-turn' : 'player2-turn'}`}>
        {board.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell ? 'filled' : ''}`}
            onClick={() => handleCellClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-box">
            <div className="overlay-text">
              {winner ? `${winner} wins` : 'No one wins'}
            </div>
            <div className="overlay-moves">
              A total of {board.filter(cell => cell !== null).length} moves were complete
            </div>
            <button className="play-again-button" onClick={handlePlayAgain}>
              Play again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicTacToe;

