import { useState, useEffect, useRef } from 'react';
import { updateSealTheBoxStats, getSealTheBoxStats, addGamePlayTime } from '../utils/storage';
import StatsButton from './StatsButton';
import './SealTheBox.css';

function SealTheBox() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentBelt, setCurrentBelt] = useState(1); // 0, 1, or 2
  const [boxes, setBoxes] = useState([[], [], []]); // boxes for each belt
  const [sealedBoxes, setSealedBoxes] = useState(new Set());
  const [unsealedMissed, setUnsealedMissed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [boxesSealed, setBoxesSealed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [beltOffset, setBeltOffset] = useState([0, 0, 0]);
  const animationRef = useRef(null);
  const beltSpeed = 20; // px per second
  const frameRate = 60;

  useEffect(() => {
    // Initialize boxes on each belt
    const initialBoxes = [[], [], []];
    for (let belt = 0; belt < 3; belt++) {
      let position = window.innerWidth + Math.random() * 500;
      const maxPosition = window.innerWidth + 2000;
      while (position < maxPosition) {
        initialBoxes[belt].push({
          id: `${belt}-${Date.now()}-${Math.random()}`,
          position: position,
          sealed: false
        });
        position += Math.random() * 300 + 100; // Min 100px spacing
      }
    }
    setBoxes(initialBoxes);
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        const deltaTime = 1 / frameRate;
        const moveDistance = beltSpeed * deltaTime;

        setBoxes((prevBoxes) => {
          const newBoxes = [[], [], []];
          let missedCount = 0;

          for (let belt = 0; belt < 3; belt++) {
            for (let box of prevBoxes[belt]) {
              const newPosition = box.position - moveDistance;
              
              // Avatar position (centered)
              const avatarCenter = window.innerWidth / 2;
              const avatarLeft = avatarCenter - 25; // Avatar is 50px wide
              const avatarRight = avatarCenter + 25;
              
              // Box edges
              const boxLeft = newPosition;
              const boxRight = newPosition + 100; // Box is 100px wide
              
              // Check if box moved off screen
              if (boxRight < 0) {
                if (!box.sealed && !sealedBoxes.has(box.id)) {
                  missedCount++;
                }
                continue; // Remove box
              }

              // Check if box should be sealed (touching avatar on same belt)
              // "As long as the right side edge of the box hasn't fully surpass the left side edge of the avatar"
              let shouldSeal = false;
              if (belt === currentBelt && !box.sealed && !sealedBoxes.has(box.id)) {
                // Box is touching if: boxRight >= avatarLeft (right edge hasn't passed left edge of avatar)
                // AND box is on the same belt
                if (boxRight >= avatarLeft && boxLeft <= avatarRight) {
                  shouldSeal = true;
                }
              }

              if (shouldSeal) {
                setSealedBoxes((prev) => {
                  const newSet = new Set(prev);
                  newSet.add(box.id);
                  return newSet;
                });
                setBoxesSealed((prev) => prev + 1);
                newBoxes[belt].push({ ...box, position: newPosition, sealed: true });
              } else {
                newBoxes[belt].push({ ...box, position: newPosition });
              }
            }

            // Add new boxes periodically
            if (Math.random() < 0.01) {
              const lastBox = newBoxes[belt][newBoxes[belt].length - 1];
              const newPosition = lastBox 
                ? lastBox.position + Math.random() * 300 + 200 
                : window.innerWidth + Math.random() * 500;
              newBoxes[belt].push({
                id: `${belt}-${Date.now()}-${Math.random()}`,
                position: newPosition,
                sealed: false
              });
            }
          }

          // Check game over condition
          if (missedCount > 0) {
            setUnsealedMissed((prev) => {
              const newCount = prev + missedCount;
              if (newCount >= 3) {
                setGameOver(true);
                const playTime = (Date.now() - startTime) / 1000;
                addGamePlayTime('sealTheBox', playTime);
                const stats = getSealTheBoxStats();
                if (boxesSealed > stats.bestScore) {
                  updateSealTheBoxStats(boxesSealed);
                }
              }
              return newCount;
            });
          }

          return newBoxes;
        });

        // Update belt animation offset
        setBeltOffset((prev) => [
          prev[0] - moveDistance,
          prev[1] - moveDistance,
          prev[2] - moveDistance
        ]);
      }, 1000 / frameRate);

      animationRef.current = interval;
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver, currentBelt, sealedBoxes, boxesSealed, startTime]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted && e.key) {
        setGameStarted(true);
        setStartTime(Date.now());
      } else if (gameStarted && !gameOver) {
        if (e.key === 'ArrowUp' && currentBelt > 0) {
          setCurrentBelt(currentBelt - 1);
        } else if (e.key === 'ArrowDown' && currentBelt < 2) {
          setCurrentBelt(currentBelt + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, currentBelt]);

  const handlePlayAgain = () => {
    setGameStarted(false);
    setCurrentBelt(1);
    setBoxes([[], [], []]);
    setSealedBoxes(new Set());
    setUnsealedMissed(0);
    setGameOver(false);
    setBoxesSealed(0);
    setStartTime(null);
    setBeltOffset([0, 0, 0]);
    
    // Reinitialize boxes
    const initialBoxes = [[], [], []];
    for (let belt = 0; belt < 3; belt++) {
      let position = window.innerWidth + Math.random() * 500;
      const maxPosition = window.innerWidth + 2000;
      while (position < maxPosition) {
        initialBoxes[belt].push({
          id: `${belt}-${Date.now()}-${Math.random()}`,
          position: position,
          sealed: false
        });
        position += Math.random() * 300 + 100;
      }
    }
    setBoxes(initialBoxes);
  };

  const stats = getSealTheBoxStats();

  return (
    <div className="main-body seal-the-box">
      <StatsButton />
      {!gameStarted && (
        <div className="start-message">Press any key to start</div>
      )}
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <div className="stat-item">
              Total boxes sealed: {boxesSealed}
            </div>
            <div className="stat-item">
              Best score: {stats.bestScore}
            </div>
            <button className="play-again-button" onClick={handlePlayAgain}>
              Play again
            </button>
          </div>
        </div>
      )}
      <div className="belts-container">
        {[0, 1, 2].map((beltIndex) => (
          <div key={beltIndex} className="belt-wrapper" style={{ marginBottom: '100px' }}>
            <div 
              className="belt" 
              style={{ 
                backgroundPositionX: `${beltOffset[beltIndex] % 40}px`
              }}
            ></div>
            <div className="belt-content">
              {boxes[beltIndex].map((box) => (
                <div
                  key={box.id}
                  className={`box ${box.sealed || sealedBoxes.has(box.id) ? 'sealed' : 'unsealed'}`}
                  style={{ left: `${box.position}px` }}
                >
                  {box.sealed || sealedBoxes.has(box.id) ? '✓' : '□'}
                </div>
              ))}
              {beltIndex === currentBelt && (
                <div className="avatar" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                  👤
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SealTheBox;
