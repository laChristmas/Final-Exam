import { Link } from 'react-router-dom';
import StatsButton from './StatsButton';
import './StatsPanel.css';

const StatsPanel = () => {
  // Get Guess The Number stats
  const getGuessTheNumberStats = () => {
    const difficulties = ['Easy', 'Medium', 'Hard'];
    return difficulties.map(diff => {
      const stats = JSON.parse(localStorage.getItem(`guessTheNumber_${diff}`) || '{"bestTime": 0, "correct": 0, "total": 0}');
      return {
        difficulty: diff,
        bestTime: stats.bestTime || 0,
        correct: stats.correct || 0,
        total: stats.total || 0,
        ratio: stats.total > 0 ? `${stats.correct}/${stats.total}` : '0/0'
      };
    });
  };

  // Get Tic Tac Toe stats
  const getTicTacToeStats = () => {
    const stats = JSON.parse(localStorage.getItem('ticTacToeStats') || '{"player1Wins": 0, "player2Wins": 0, "totalGames": 0}');
    const totalGames = stats.totalGames || 0;
    return {
      player1Wins: stats.player1Wins || 0,
      player2Wins: stats.player2Wins || 0,
      totalGames,
      player1Ratio: totalGames > 0 ? `${stats.player1Wins || 0}/${totalGames}` : '0/0',
      player2Ratio: totalGames > 0 ? `${stats.player2Wins || 0}/${totalGames}` : '0/0'
    };
  };

  // Get Seal The Box stats
  const getSealTheBoxStats = () => {
    const stats = JSON.parse(localStorage.getItem('sealTheBoxStats') || '{"bestScore": 0}');
    return stats.bestScore || 0;
  };

  // Get general game stats
  const getGeneralStats = () => {
    const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
    const games = ['guessTheNumber', 'ticTacToe', 'sealTheBox'];
    return games.map(gameName => {
      const game = gameStats[gameName] || { plays: 0, totalTime: 0 };
      const plays = game.plays || 0;
      const totalTime = game.totalTime || 0;
      const avgTime = plays > 0 ? (totalTime / plays).toFixed(2) : '0.00';
      return {
        name: gameName === 'guessTheNumber' ? 'Guess The Number' : 
              gameName === 'ticTacToe' ? 'Tic Tac Toe' : 'Seal The Box',
        plays,
        avgTime
      };
    });
  };

  const guessStats = getGuessTheNumberStats();
  const ticTacToeStats = getTicTacToeStats();
  const sealTheBoxBest = getSealTheBoxStats();
  const generalStats = getGeneralStats();

  return (
    <div className="stats-panel main-body">
      <StatsButton />
      <div className="stats-content">
        <h1 className="stats-title">Statistics</h1>
        
        <div className="stats-section">
          <h2>Guess The Number</h2>
          {guessStats.map(stat => (
            <div key={stat.difficulty} className="stat-item">
              <div className="stat-label">{stat.difficulty} level:</div>
              <div className="stat-value">
                Best score (longest remaining time): {stat.bestTime} seconds
              </div>
              <div className="stat-value">
                Correct guessing ratio: {stat.ratio}
              </div>
            </div>
          ))}
        </div>

        <div className="stats-section">
          <h2>Tic Tac Toe</h2>
          <div className="stat-item">
            <div className="stat-label">Player 1 (O) wins:</div>
            <div className="stat-value">{ticTacToeStats.player1Wins}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Player 2 (X) wins:</div>
            <div className="stat-value">{ticTacToeStats.player2Wins}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Player 1 win ratio:</div>
            <div className="stat-value">{ticTacToeStats.player1Ratio}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Player 2 win ratio:</div>
            <div className="stat-value">{ticTacToeStats.player2Ratio}</div>
          </div>
        </div>

        <div className="stats-section">
          <h2>Seal The Box</h2>
          <div className="stat-item">
            <div className="stat-label">Best score:</div>
            <div className="stat-value">{sealTheBoxBest} boxes sealed</div>
          </div>
        </div>

        <div className="stats-section">
          <h2>General Statistics</h2>
          {generalStats.map(stat => (
            <div key={stat.name} className="stat-item">
              <div className="stat-label">{stat.name}:</div>
              <div className="stat-value">
                Times played: {stat.plays}
              </div>
              <div className="stat-value">
                Average time: {stat.avgTime} seconds
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;

