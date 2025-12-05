import { Link } from 'react-router-dom';
import './StatsPanel.css';

function StatsPanel() {
  const guessStats = JSON.parse(localStorage.getItem('guessTheNumberStats') || '{}');
  const ticTacToeStats = JSON.parse(localStorage.getItem('ticTacToeStats') || '{}');
  const sealTheBoxStats = JSON.parse(localStorage.getItem('sealTheBoxStats') || '{}');
  const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');

  const getAverageTime = (gameName) => {
    const game = gameStats[gameName];
    if (!game || !game.plays || game.plays === 0) return '0.00';
    const avg = (game.totalTime || 0) / game.plays;
    return avg.toFixed(2);
  };

  const getPlayCount = (gameName) => {
    return gameStats[gameName]?.plays || 0;
  };

  const difficulties = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="main-body stats-panel">
      <div className="stats-content">
        <h1>Game Statistics</h1>

        <section className="stats-section">
          <h2>Guess The Number</h2>
          {difficulties.map(level => {
            const levelStats = guessStats[level] || { total: 0, wins: 0, bestTime: null };
            const ratio = levelStats.total > 0 
              ? `${levelStats.wins}/${levelStats.total}` 
              : '0/0';
            const bestTime = levelStats.bestTime !== null ? levelStats.bestTime : 'N/A';
            return (
              <div key={level} className="stat-item">
                <p><strong>{level} level:</strong></p>
                <p>Best score (longest remaining time): {bestTime} seconds</p>
                <p>Correct guessing ratio: {ratio}</p>
              </div>
            );
          })}
        </section>

        <section className="stats-section">
          <h2>Tic Tac Toe</h2>
          <div className="stat-item">
            <p><strong>Player 1 (O) has won:</strong> {ticTacToeStats.player1 || 0}</p>
            <p><strong>Player 2 (X) has won:</strong> {ticTacToeStats.player2 || 0}</p>
          </div>
          <div className="stat-item">
            <p>
              <strong>Player 1 win ratio:</strong>{' '}
              {ticTacToeStats.total > 0 
                ? `${ticTacToeStats.player1 || 0}/${ticTacToeStats.total}`
                : '0/0'}
            </p>
            <p>
              <strong>Player 2 win ratio:</strong>{' '}
              {ticTacToeStats.total > 0 
                ? `${ticTacToeStats.player2 || 0}/${ticTacToeStats.total}`
                : '0/0'}
            </p>
          </div>
        </section>

        <section className="stats-section">
          <h2>Seal The Box</h2>
          <div className="stat-item">
            <p><strong>Best score:</strong> {sealTheBoxStats.bestScore || 0}</p>
          </div>
        </section>

        <section className="stats-section">
          <h2>General Statistics</h2>
          <div className="stat-item">
            <p><strong>Guess The Number plays:</strong> {getPlayCount('guessTheNumber')}</p>
            <p><strong>Average time:</strong> {getAverageTime('guessTheNumber')} seconds</p>
          </div>
          <div className="stat-item">
            <p><strong>Tic Tac Toe plays:</strong> {getPlayCount('ticTacToe')}</p>
            <p><strong>Average time:</strong> {getAverageTime('ticTacToe')} seconds</p>
          </div>
          <div className="stat-item">
            <p><strong>Seal The Box plays:</strong> {getPlayCount('sealTheBox')}</p>
            <p><strong>Average time:</strong> {getAverageTime('sealTheBox')} seconds</p>
          </div>
        </section>
      </div>
      <Link to="/statspanel" className="stats-button">Stats</Link>
    </div>
  );
}

export default StatsPanel;

