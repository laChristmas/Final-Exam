import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TicTacToe.css';

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);

  useEffect(() => {
    setGameStartTime(Date.now());
    
    // Track game start
    const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
    if (!gameStats.ticTacToe) {
      gameStats.ticTacToe = { plays: 0, totalTime: 0 };
    }
    gameStats.ticTacToe.plays = (gameStats.ticTacToe.plays || 0) + 1;
    gameStats.ticTacToe.startTime = Date.now();
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
  }, []);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || gameOver || isAnimating) return;

    const newBoard = [...board];
    newBoard[index] = isPlayer1Turn ? 'O' : 'X';
    setBoard(newBoard);
    setIsPlayer1Turn(!isPlayer1Turn);
    setMoveCount(prev => prev + 1);

    const winner = checkWinner(newBoard);
    const isBoardFull = newBoard.every(cell => cell !== null);

    if (winner || isBoardFull) {
      setGameOver(true);
      setWinner(winner);
      
      // Start animation
      setIsAnimating(true);
      let animationCount = 0;
      const animationInterval = setInterval(() => {
        animationCount++;
        if (animationCount >= 6) { // 3 seconds / 0.5 seconds = 6
          clearInterval(animationInterval);
          setIsAnimating(false);
        }
      }, 500);

      // Track game end
      const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
      if (gameStats.ticTacToe && gameStats.ticTacToe.startTime) {
        const timeSpent = (Date.now() - gameStats.ticTacToe.startTime) / 1000;
        gameStats.ticTacToe.totalTime = (gameStats.ticTacToe.totalTime || 0) + timeSpent;
        delete gameStats.ticTacToe.startTime;
        localStorage.setItem('gameStats', JSON.stringify(gameStats));
      }

      // Track stats
      const stats = JSON.parse(localStorage.getItem('ticTacToeStats') || '{}');
      if (!stats.player1) stats.player1 = 0;
      if (!stats.player2) stats.player2 = 0;
      if (!stats.total) stats.total = 0;
      
      stats.total = (stats.total || 0) + 1;
      
      if (winner === 'O') {
        stats.player1 = (stats.player1 || 0) + 1;
        // Trigger game win event (Player 1 wins)
        window.dispatchEvent(new Event('gameWin'));
      } else if (winner === 'X') {
        stats.player2 = (stats.player2 || 0) + 1;
      }
      
      localStorage.setItem('ticTacToeStats', JSON.stringify(stats));
    }
  };

  const handlePlayAgain = () => {
    setBoard(Array(9).fill(null));
    setIsPlayer1Turn(true);
    setGameOver(false);
    setWinner(null);
    setMoveCount(0);
    setIsAnimating(false);
    setGameStartTime(Date.now());
    
    // Track new game start
    const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
    if (!gameStats.ticTacToe) {
      gameStats.ticTacToe = { plays: 0, totalTime: 0 };
    }
    gameStats.ticTacToe.plays = (gameStats.ticTacToe.plays || 0) + 1;
    gameStats.ticTacToe.startTime = Date.now();
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
  };

  const getCellClassName = (index) => {
    let className = 'cell';
    if (board[index]) {
      className += ' filled';
    } else if (!gameOver && !isAnimating) {
      className += isPlayer1Turn ? ' player1-turn' : ' player2-turn';
    }
    if (isAnimating) {
      className += ' animating';
    }
    return className;
  };

  return (
    <div className="main-body tic-tac-toe">
      <div className="board-container">
        <div className="board">
          {board.map((cell, index) => (
            <div
              key={index}
              className={getCellClassName(index)}
              onClick={() => handleClick(index)}
            >
              {cell}
            </div>
          ))}
        </div>
        {gameOver && !isAnimating && (
          <div className="overlay">
            <div className="overlay-content">
              <p className="winner-text">
                {winner ? `${winner} wins` : 'No one wins'}
              </p>
              <p className="moves-text">
                A total of {moveCount} moves were complete
              </p>
              <button className="play-again-button" onClick={handlePlayAgain}>
                Play again
              </button>
            </div>
          </div>
        )}
      </div>
      <Link to="/statspanel" className="stats-button">Stats</Link>
    </div>
  );
}

export default TicTacToe;

