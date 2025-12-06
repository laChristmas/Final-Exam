// Utility functions for localStorage management

export const getGamesToWin = () => {
  const stored = localStorage.getItem('gamesToWin');
  return stored !== null ? parseInt(stored, 10) : null;
};

export const setGamesToWin = (value) => {
  localStorage.setItem('gamesToWin', value.toString());
};

export const getGameStats = (gameName) => {
  const stored = localStorage.getItem(`stats_${gameName}`);
  return stored ? JSON.parse(stored) : null;
};

export const setGameStats = (gameName, stats) => {
  localStorage.setItem(`stats_${gameName}`, JSON.stringify(stats));
};

export const updateGameStats = (gameName, updates) => {
  const current = getGameStats(gameName) || {};
  const updated = { ...current, ...updates };
  setGameStats(gameName, updated);
};

// Guess The Number stats
export const getGuessTheNumberStats = () => {
  return getGameStats('guessTheNumber') || {
    easy: { bestTime: null, correct: 0, total: 0 },
    medium: { bestTime: null, correct: 0, total: 0 },
    hard: { bestTime: null, correct: 0, total: 0 }
  };
};

export const updateGuessTheNumberStats = (difficulty, timeLeft, guessed) => {
  const stats = getGuessTheNumberStats();
  stats[difficulty].total += 1;
  if (guessed) {
    stats[difficulty].correct += 1;
    if (stats[difficulty].bestTime === null || timeLeft > stats[difficulty].bestTime) {
      stats[difficulty].bestTime = timeLeft;
    }
  }
  setGameStats('guessTheNumber', stats);
};

// Tic Tac Toe stats
export const getTicTacToeStats = () => {
  return getGameStats('ticTacToe') || {
    player1Wins: 0,
    player2Wins: 0,
    totalGames: 0
  };
};

export const updateTicTacToeStats = (winner) => {
  const stats = getTicTacToeStats();
  stats.totalGames += 1;
  if (winner === 'O') {
    stats.player1Wins += 1;
  } else if (winner === 'X') {
    stats.player2Wins += 1;
  }
  setGameStats('ticTacToe', stats);
};

// Seal The Box stats
export const getSealTheBoxStats = () => {
  return getGameStats('sealTheBox') || {
    bestScore: 0,
    totalGames: 0
  };
};

export const updateSealTheBoxStats = (boxesSealed) => {
  const stats = getSealTheBoxStats();
  stats.totalGames += 1;
  if (boxesSealed > stats.bestScore) {
    stats.bestScore = boxesSealed;
  }
  setGameStats('sealTheBox', stats);
};

// Game play time tracking
export const getGamePlayTimes = () => {
  return getGameStats('playTimes') || {
    guessTheNumber: { total: 0, count: 0 },
    ticTacToe: { total: 0, count: 0 },
    sealTheBox: { total: 0, count: 0 }
  };
};

export const addGamePlayTime = (gameName, timeInSeconds) => {
  const times = getGamePlayTimes();
  if (!times[gameName]) {
    times[gameName] = { total: 0, count: 0 };
  }
  times[gameName].total += timeInSeconds;
  times[gameName].count += 1;
  setGameStats('playTimes', times);
};

