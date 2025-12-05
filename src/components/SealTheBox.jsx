import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import unsealedBoxImg from '../assets/unsealed-box.svg';
import sealedBoxImg from '../assets/sealed-box.svg';
import './SealTheBox.css';

function SealTheBox() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentBelt, setCurrentBelt] = useState(1); // 0, 1, or 2
  const [boxes, setBoxes] = useState([[], [], []]); // Boxes for each belt
  const [sealedBoxes, setSealedBoxes] = useState(new Set());
  const [unsealedPassed, setUnsealedPassed] = useState(0);
  const [sealedCount, setSealedCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  const animationFrameRef = useRef(null);
  const lastBoxIdRef = useRef(0);
  const lastBoxPositionRef = useRef([-Infinity, -Infinity, -Infinity]);
  const sealedCountRef = useRef(0);

  useEffect(() => {
    // Initialize boxes on each belt
    const initialBoxes = [[], [], []];
    for (let belt = 0; belt < 3; belt++) {
      let lastPos = -100;
      for (let i = 0; i < 5; i++) {
        const spacing = 100 + Math.random() * 200;
        const box = {
          id: lastBoxIdRef.current++,
          x: lastPos + spacing,
          sealed: false
        };
        initialBoxes[belt].push(box);
        lastPos = box.x;
      }
      lastBoxPositionRef.current[belt] = lastPos;
    }
    setBoxes(initialBoxes);

    // Track game start
    const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
    if (!gameStats.sealTheBox) {
      gameStats.sealTheBox = { plays: 0, totalTime: 0 };
    }
    gameStats.sealTheBox.plays = (gameStats.sealTheBox.plays || 0) + 1;
    gameStats.sealTheBox.startTime = Date.now();
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
    setGameStartTime(Date.now());

    const handleKeyPress = (e) => {
      if (!gameStarted && e.key) {
        setGameStarted(true);
      }
    };

    const handleKeyDown = (e) => {
      if (gameStarted && !gameOver) {
        if (e.key === 'ArrowUp' && currentBelt > 0) {
          setCurrentBelt(prev => prev - 1);
        } else if (e.key === 'ArrowDown' && currentBelt < 2) {
          setCurrentBelt(prev => prev + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted, currentBelt, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    let lastTime = performance.now();
    const speed = 20; // pixels per second

    const moveBoxes = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;
      const moveDistance = speed * deltaTime;

      setBoxes(prevBoxes => {
        const newBoxes = [[], [], []];
        let newUnsealedPassed = 0;

        for (let belt = 0; belt < 3; belt++) {
          for (const box of prevBoxes[belt]) {
            const newX = box.x - moveDistance;
            
            // Check if box should be sealed (avatar on same belt and box hasn't fully passed)
            let isSealed = box.sealed;
            if (!isSealed && belt === currentBelt) {
              const avatarX = window.innerWidth * 0.1; // Avatar position (10% from left)
              const boxRight = newX + 100;
              const avatarLeft = avatarX;
              
              // Box is touched if right edge hasn't fully passed left edge of avatar
              if (boxRight >= avatarLeft && newX <= avatarLeft + 50) {
                isSealed = true;
                setSealedBoxes(prev => new Set([...prev, box.id]));
                setSealedCount(prev => {
                  const newCount = prev + 1;
                  sealedCountRef.current = newCount;
                  return newCount;
                });
              }
            }

            // Check if box passed off screen
            if (newX + 100 < 0) {
              if (!isSealed) {
                newUnsealedPassed++;
              }
            } else {
              newBoxes[belt].push({ ...box, x: newX, sealed: isSealed });
            }
          }

          // Add new boxes when needed
          const lastBox = newBoxes[belt].length > 0 
            ? newBoxes[belt][newBoxes[belt].length - 1]
            : null;
          const shouldAddBox = !lastBox || lastBox.x < window.innerWidth - 100;
          
          if (shouldAddBox) {
            const spacing = 100 + Math.random() * 200;
            const startX = lastBox ? lastBox.x + spacing : window.innerWidth + Math.random() * 200;
            newBoxes[belt].push({
              id: lastBoxIdRef.current++,
              x: startX,
              sealed: false
            });
          }
        }

        if (newUnsealedPassed > 0) {
          setUnsealedPassed(prev => {
            const newTotal = prev + newUnsealedPassed;
            if (newTotal >= 3) {
              setGameOver(true);
              
              // Track game end
              const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
              if (gameStats.sealTheBox && gameStats.sealTheBox.startTime) {
                const timeSpent = (Date.now() - gameStats.sealTheBox.startTime) / 1000;
                gameStats.sealTheBox.totalTime = (gameStats.sealTheBox.totalTime || 0) + timeSpent;
                delete gameStats.sealTheBox.startTime;
                localStorage.setItem('gameStats', JSON.stringify(gameStats));
              }

              // Track stats
              const stats = JSON.parse(localStorage.getItem('sealTheBoxStats') || '{}');
              const currentBest = stats.bestScore || 0;
              const currentSealed = sealedCountRef.current;
              if (currentSealed > currentBest) {
                stats.bestScore = currentSealed;
                localStorage.setItem('sealTheBoxStats', JSON.stringify(stats));
              }
            }
            return newTotal;
          });
        }

        return newBoxes;
      });

      if (!gameOver) {
        animationFrameRef.current = requestAnimationFrame(moveBoxes);
      }
    };

    animationFrameRef.current = requestAnimationFrame(moveBoxes);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, gameOver, currentBelt]);

  const handlePlayAgain = () => {
    setGameStarted(false);
    setCurrentBelt(1);
    setUnsealedPassed(0);
    setSealedCount(0);
    sealedCountRef.current = 0;
    setGameOver(false);
    setSealedBoxes(new Set());
    lastBoxIdRef.current = 0;
    lastBoxPositionRef.current = [-Infinity, -Infinity, -Infinity];

    // Reinitialize boxes
    const initialBoxes = [[], [], []];
    for (let belt = 0; belt < 3; belt++) {
      let lastPos = -100;
      for (let i = 0; i < 5; i++) {
        const spacing = 100 + Math.random() * 200;
        const box = {
          id: lastBoxIdRef.current++,
          x: lastPos + spacing,
          sealed: false
        };
        initialBoxes[belt].push(box);
        lastPos = box.x;
      }
      lastBoxPositionRef.current[belt] = lastPos;
    }
    setBoxes(initialBoxes);

    // Track new game start
    const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
    if (!gameStats.sealTheBox) {
      gameStats.sealTheBox = { plays: 0, totalTime: 0 };
    }
    gameStats.sealTheBox.plays = (gameStats.sealTheBox.plays || 0) + 1;
    gameStats.sealTheBox.startTime = Date.now();
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
    setGameStartTime(Date.now());
  };

  const stats = JSON.parse(localStorage.getItem('sealTheBoxStats') || '{}');
  const bestScore = stats.bestScore || 0;

  return (
    <div className="main-body seal-the-box">
      {!gameStarted && (
        <div className="start-message">
          <p>Press any key to start</p>
        </div>
      )}
      <div className="belts-container">
        {[0, 1, 2].map(beltIndex => (
          <div key={beltIndex} className="belt-wrapper">
            <div className="belt" style={{ 
              animation: gameStarted ? 'moveBelt 3s linear infinite' : 'none'
            }}>
            </div>
            <div className="belt-content">
              {boxes[beltIndex].map(box => (
                <img
                  key={box.id}
                  src={box.sealed ? sealedBoxImg : unsealedBoxImg}
                  alt={box.sealed ? 'Sealed box' : 'Unsealed box'}
                  className="box"
                  style={{ left: `${box.x}px` }}
                />
              ))}
              {beltIndex === currentBelt && (
                <div 
                  className="avatar"
                  style={{ left: '10%' }}
                >
                  <img 
                    src="https://via.placeholder.com/50x50/fff/000?text=U" 
                    alt="Avatar"
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <p>Total boxes sealed: {sealedCount}</p>
            <p>Best score: {bestScore}</p>
            <button className="play-again-button" onClick={handlePlayAgain}>
              Play again
            </button>
          </div>
        </div>
      )}
      <Link to="/statspanel" className="stats-button">Stats</Link>
    </div>
  );
}

export default SealTheBox;

