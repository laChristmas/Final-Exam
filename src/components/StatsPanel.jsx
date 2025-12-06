import { getGuessTheNumberStats, getTicTacToeStats, getSealTheBoxStats, getGamePlayTimes } from '../utils/storage';
import StatsButton from './StatsButton';
import './StatsPanel.css';

function StatsPanel() {
  const guessStats = getGuessTheNumberStats();
  const ticTacToeStats = getTicTacToeStats();
  const sealStats = getSealTheBoxStats();
  const playTimes = getGamePlayTimes();

  const getAverageTime = (gameName) => {
    const times = playTimes[gameName];
    if (!times || times.count === 0) return 'N/A';
    return (times.total / times.count).toFixed(2) + 's';
  };

  return (
    <div className="main-body stats-panel">
      <StatsButton />
      <div className="stats-container">
        <h1 className="stats-title">Game Statistics</h1>
        
        <div className="stats-section">
          <h2>Guess The Number</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Easy - Best Score (time left):</div>
              <div className="stat-value">
                {guessStats.easy.bestTime !== null ? `${guessStats.easy.bestTime}s` : 'N/A'}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Easy - Correct Ratio:</div>
              <div className="stat-value">
                {guessStats.easy.total > 0 
                  ? `${guessStats.easy.correct}/${guessStats.easy.total}` 
                  : '0/0'}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Medium - Best Score (time left):</div>
              <div className="stat-value">
                {guessStats.medium.bestTime !== null ? `${guessStats.medium.bestTime}s` : 'N/A'}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Medium - Correct Ratio:</div>
              <div className="stat-value">
                {guessStats.medium.total > 0 
                  ? `${guessStats.medium.correct}/${guessStats.medium.total}` 
                  : '0/0'}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Hard - Best Score (time left):</div>
              <div className="stat-value">
                {guessStats.hard.bestTime !== null ? `${guessStats.hard.bestTime}s` : 'N/A'}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Hard - Correct Ratio:</div>
              <div className="stat-value">
                {guessStats.hard.total > 0 
                  ? `${guessStats.hard.correct}/${guessStats.hard.total}` 
                  : '0/0'}
              </div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h2>Tic Tac Toe</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Player1 (O) has won:</div>
              <div className="stat-value">{ticTacToeStats.player1Wins}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Player1 (O) win ratio:</div>
              <div className="stat-value">
                {ticTacToeStats.totalGames > 0 
                  ? `${ticTacToeStats.player1Wins}/${ticTacToeStats.totalGames}` 
                  : '0/0'}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Player2 (X) has won:</div>
              <div className="stat-value">{ticTacToeStats.player2Wins}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Player2 (X) win ratio:</div>
              <div className="stat-value">
                {ticTacToeStats.totalGames > 0 
                  ? `${ticTacToeStats.player2Wins}/${ticTacToeStats.totalGames}` 
                  : '0/0'}
              </div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h2>Seal The Box</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Best Score:</div>
              <div className="stat-value">{sealStats.bestScore}</div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h2>General Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Guess The Number - Times Played:</div>
              <div className="stat-value">{playTimes.guessTheNumber?.count || 0}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Guess The Number - Average Time:</div>
              <div className="stat-value">{getAverageTime('guessTheNumber')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Tic Tac Toe - Times Played:</div>
              <div className="stat-value">{playTimes.ticTacToe?.count || 0}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Tic Tac Toe - Average Time:</div>
              <div className="stat-value">{getAverageTime('ticTacToe')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Seal The Box - Times Played:</div>
              <div className="stat-value">{playTimes.sealTheBox?.count || 0}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Seal The Box - Average Time:</div>
              <div className="stat-value">{getAverageTime('sealTheBox')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;

