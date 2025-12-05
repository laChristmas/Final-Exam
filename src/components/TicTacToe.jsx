import { useState, useEffect } from 'react';
import StatsButton from './StatsButton';
import './TicTacToe.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);
  const [gameComplete, setGameComplete] = useState(false);
  const [winner, setWinner] = useState(null);
  const [moves, setMoves] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [animating, setAnimating] = useState(false);

  const checkWinner = (currentBoard) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return null;
  };

  const handleCellClick = (index) => {
    if (board[index] || gameComplete) return;

    const newBoard = [...board];
    newBoard[index] = isPlayer1Turn ? 'O' : 'X';
    setBoard(newBoard);
    setMoves(prev => prev + 1);
    
    const winnerFound = checkWinner(newBoard);
    const isBoardFull = newBoard.every(cell => cell !== null);

    if (winnerFound) {
      setWinner(winnerFound);
      setGameComplete(true);
      handleGameEnd(winnerFound, newBoard.filter(cell => cell !== null).length);
    } else if (isBoardFull) {
      setGameComplete(true);
      handleGameEnd(null, 9);
    } else {
      setIsPlayer1Turn(!isPlayer1Turn);
    }
  };

  const handleGameEnd = (winnerSymbol, totalMoves) => {
    // Start animation
    setAnimating(true);
    
    setTimeout(() => {
      setAnimating(false);
      setShowOverlay(true);
      
      // Update stats
      const stats = JSON.parse(localStorage.getItem('ticTacToeStats') || '{"player1Wins": 0, "player2Wins": 0, "totalGames": 0}');
      stats.totalGames += 1;
      
      if (winnerSymbol === 'O') {
        stats.player1Wins += 1;
        // Trigger game win event for dashboard
        window.dispatchEvent(new CustomEvent('gameWin'));
      } else if (winnerSymbol === 'X') {
        stats.player2Wins += 1;
      }
      
      localStorage.setItem('ticTacToeStats', JSON.stringify(stats));
      
      // Update game play stats
      const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{"ticTacToe": {"plays": 0, "totalTime": 0}}');
      if (!gameStats.ticTacToe) {
        gameStats.ticTacToe = { plays: 0, totalTime: 0 };
      }
      gameStats.ticTacToe.plays += 1;
      const gameStartTime = localStorage.getItem('ticTacToeStartTime');
      if (gameStartTime) {
        const timeSpent = (Date.now() - parseInt(gameStartTime, 10)) / 1000;
        gameStats.ticTacToe.totalTime += timeSpent;
        localStorage.removeItem('ticTacToeStartTime');
      }
      localStorage.setItem('gameStats', JSON.stringify(gameStats));
    }, 3000);
  };

  const handlePlayAgain = () => {
    setBoard(Array(9).fill(null));
    setIsPlayer1Turn(true);
    setGameComplete(false);
    setWinner(null);
    setMoves(0);
    setShowOverlay(false);
    setAnimating(false);
    localStorage.setItem('ticTacToeStartTime', Date.now().toString());
  };

  useEffect(() => {
    localStorage.setItem('ticTacToeStartTime', Date.now().toString());
  }, []);

  const getCellClassName = (index) => {
    let className = 'cell';
    if (board[index]) {
      className += ' filled';
    } else if (!gameComplete) {
      className += isPlayer1Turn ? ' player1-turn' : ' player2-turn';
    }
    if (animating) {
      className += ' animating';
    }
    return className;
  };

  return (
    <div className="tic-tac-toe main-body">
      <StatsButton />
      <div className="board-container">
        <div className={`board ${animating ? 'animating' : ''}`}>
          {board.map((cell, index) => (
            <div
              key={index}
              className={getCellClassName(index)}
              onClick={() => handleCellClick(index)}
            >
              {cell}
            </div>
          ))}
        </div>
        {showOverlay && (
          <div className="overlay">
            <div className="overlay-box">
              <div className="winner-text">
                {winner ? `${winner} wins` : 'No one wins'}
              </div>
              <div className="moves-text">
                A total of {moves} moves were complete
              </div>
              <button className="play-again-button" onClick={handlePlayAgain}>
                Play again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicTacToe;

