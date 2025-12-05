import { useState, useEffect, useRef } from 'react';
import unsealedBoxImg from '../assets/unsealed-box.svg';
import sealedBoxImg from '../assets/sealed-box.svg';
import StatsButton from './StatsButton';
import './SealTheBox.css';

const SealTheBox = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentBelt, setCurrentBelt] = useState(1); // 0, 1, or 2
  const [belts, setBelts] = useState([
    { boxes: [], offset: 0 },
    { boxes: [], offset: 0 },
    { boxes: [], offset: 0 }
  ]);
  const [sealedCount, setSealedCount] = useState(0);
  const [finalSealedCount, setFinalSealedCount] = useState(0);
  const [unsealedPassed, setUnsealedPassed] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const gameStartTimeRef = useRef(null);
  const currentBeltRef = useRef(1);
  const unsealedPassedRef = useRef(0);

  const BELT_HEIGHT = 10;
  const BOX_SIZE = 100;
  const BOX_SPACING = 100;
  const SPEED = 20; // pixels per second
  const BELT_GAP = 100;

  useEffect(() => {
    // Initialize boxes on belts
    const initializeBoxes = () => {
      const newBelts = [];
      for (let i = 0; i < 3; i++) {
        const boxes = [];
        let position = window.innerWidth + 200;
        while (position < window.innerWidth + 2000) {
          boxes.push({
            id: Math.random(),
            x: position,
            sealed: false
          });
          position += BOX_SIZE + BOX_SPACING + Math.random() * 200;
        }
        newBelts.push({ boxes, offset: 0 });
      }
      setBelts(newBelts);
    };

    initializeBoxes();

    const handleKeyPress = (e) => {
      if (!gameStarted && e.key) {
        setGameStarted(true);
        gameStartTimeRef.current = Date.now();
        lastTimeRef.current = Date.now();
      }
    };

    const handleArrowKeys = (e) => {
      if (!gameStarted || gameEnded) return;
      
      if (e.key === 'ArrowUp' && currentBeltRef.current > 0) {
        currentBeltRef.current = currentBeltRef.current - 1;
        setCurrentBelt(currentBeltRef.current);
      } else if (e.key === 'ArrowDown' && currentBeltRef.current < 2) {
        currentBeltRef.current = currentBeltRef.current + 1;
        setCurrentBelt(currentBeltRef.current);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keydown', handleArrowKeys);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keydown', handleArrowKeys);
    };
  }, [gameStarted, currentBelt, gameEnded]);

  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const animate = (currentTime) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = currentTime;

      setBelts((prevBelts) => {
        let totalSealed = 0;
        let newUnsealedPassed = unsealedPassedRef.current;
        let shouldEndGame = false;

        const newBelts = prevBelts.map((belt, beltIndex) => {
          const newBoxes = belt.boxes.map((box) => {
            const newX = box.x - SPEED * deltaTime;
            let isSealed = box.sealed;
            
            // Check if box is being touched by avatar
            if (!box.sealed && beltIndex === currentBeltRef.current) {
              const avatarX = window.innerWidth / 2; // Avatar is centered
              const boxRight = newX + BOX_SIZE;
              const avatarLeft = avatarX - 25; // Avatar is 50px wide, centered
              
              // Touch detection: right edge of box hasn't fully passed left edge of avatar
              if (boxRight >= avatarLeft && newX <= avatarX + 25) {
                isSealed = true;
              }
            }
            
            if (isSealed) {
              totalSealed++;
            }
            
            return { ...box, x: newX, sealed: isSealed };
          }).filter((box) => {
            // Remove boxes that have passed off screen
            if (box.x + BOX_SIZE < 0) {
              if (!box.sealed) {
                newUnsealedPassed++;
                unsealedPassedRef.current = newUnsealedPassed;
                if (newUnsealedPassed >= 3) {
                  shouldEndGame = true;
                }
              }
              return false;
            }
            return true;
          });

          // Add new boxes periodically
          const rightmostBox = newBoxes.length > 0 
            ? Math.max(...newBoxes.map(b => b.x))
            : window.innerWidth;
          
          if (rightmostBox < window.innerWidth + 500) {
            newBoxes.push({
              id: Math.random(),
              x: rightmostBox + BOX_SIZE + BOX_SPACING + Math.random() * 200,
              sealed: false
            });
          }

          return { ...belt, boxes: newBoxes };
        });

        // Update state outside of setBelts to avoid stale closures
        setSealedCount(totalSealed);
        setUnsealedPassed(newUnsealedPassed);
        
        if (shouldEndGame) {
          setTimeout(() => {
            setFinalSealedCount(totalSealed);
            setGameEnded(true);
            handleGameEnd(totalSealed);
          }, 0);
        }

        return newBelts;
      });

      if (!gameEnded) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, gameEnded]);

  const handleGameEnd = (finalSealedCount) => {
    // Update stats
    const stats = JSON.parse(localStorage.getItem('sealTheBoxStats') || '{"bestScore": 0}');
    const countToUse = finalSealedCount !== undefined ? finalSealedCount : sealedCount;
    if (countToUse > stats.bestScore) {
      stats.bestScore = countToUse;
    }
    localStorage.setItem('sealTheBoxStats', JSON.stringify(stats));

    // Update game play stats
    const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{"sealTheBox": {"plays": 0, "totalTime": 0}}');
    if (!gameStats.sealTheBox) {
      gameStats.sealTheBox = { plays: 0, totalTime: 0 };
    }
    gameStats.sealTheBox.plays += 1;
    if (gameStartTimeRef.current) {
      const timeSpent = (Date.now() - gameStartTimeRef.current) / 1000;
      gameStats.sealTheBox.totalTime += timeSpent;
    }
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
  };

  const handlePlayAgain = () => {
    setGameStarted(false);
    currentBeltRef.current = 1;
    setCurrentBelt(1);
    setSealedCount(0);
    setFinalSealedCount(0);
    unsealedPassedRef.current = 0;
    setUnsealedPassed(0);
    setGameEnded(false);
    gameStartTimeRef.current = null;
    lastTimeRef.current = null;
    
    // Reinitialize boxes
    const newBelts = [];
    for (let i = 0; i < 3; i++) {
      const boxes = [];
      let position = window.innerWidth + 200;
      while (position < window.innerWidth + 2000) {
        boxes.push({
          id: Math.random(),
          x: position,
          sealed: false
        });
        position += BOX_SIZE + BOX_SPACING + Math.random() * 200;
      }
      newBelts.push({ boxes, offset: 0 });
    }
    setBelts(newBelts);
  };

  const getAvatarY = () => {
    return currentBelt * (BELT_HEIGHT + BELT_GAP) + BELT_HEIGHT / 2;
  };

  return (
    <div className="seal-the-box main-body">
      <StatsButton />
      {gameEnded && (
        <div className="game-end-overlay">
          <div className="game-end-content">
            <div className="stat-item">
              Total boxes sealed: {finalSealedCount || sealedCount}
            </div>
            <div className="stat-item">
              Best score: {JSON.parse(localStorage.getItem('sealTheBoxStats') || '{"bestScore": 0}').bestScore}
            </div>
            <button className="play-again-button" onClick={handlePlayAgain}>
              Play again
            </button>
          </div>
        </div>
      )}
      <div className="belts-container">
        {belts.map((belt, beltIndex) => (
          <div key={beltIndex} className="belt-wrapper" style={{ marginBottom: beltIndex < 2 ? `${BELT_GAP}px` : '0' }}>
            <div className={`belt ${gameStarted ? 'moving' : ''}`} style={{ height: `${BELT_HEIGHT}px` }}></div>
            <div className="boxes-container">
              {belt.boxes.map((box) => (
                <img
                  key={box.id}
                  src={box.sealed ? sealedBoxImg : unsealedBoxImg}
                  alt={box.sealed ? 'Sealed box' : 'Unsealed box'}
                  className="box"
                  style={{
                    left: `${box.x}px`,
                    top: `${-BOX_SIZE / 2}px`,
                    width: `${BOX_SIZE}px`,
                    height: `${BOX_SIZE}px`
                  }}
                />
              ))}
            </div>
            {beltIndex === currentBelt && (
              <div
                className="avatar"
                style={{
                  top: `${-25}px`,
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              >
                <img
                  src="https://via.placeholder.com/50x50/4a4/fff?text=U"
                  alt="Avatar"
                  className="avatar-img"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {!gameStarted && (
        <div className="start-message">
          Press any key to start
        </div>
      )}
    </div>
  );
};

export default SealTheBox;

