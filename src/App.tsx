import { useState, useEffect } from 'react'
import './App.css'

const INITIAL_TIME = 20 * 60; // 20 minutes in seconds
const CORRECT_PIN = '1234'; // You can change this to any 4-digit pin
const AGENTS = ['Faya', 'Otis', 'Eppo', 'Isa', 'Ellie', 'Elliot', 'Basil', 'Suzanne'];

function App() {
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [pin, setPin] = useState('');
  const [gameState, setGameState] = useState<'welcome' | 'running' | 'exploded' | 'defused'>('welcome');
  const [showError, setShowError] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
  const [isAgentVisible, setIsAgentVisible] = useState(true);

  // Agent cycling effect
  useEffect(() => {
    if (gameState !== 'welcome') return;

    const fadeTimer = setInterval(() => {
      setIsAgentVisible(false);
      setTimeout(() => {
        setCurrentAgentIndex(prev => (prev + 1) % AGENTS.length);
        setIsAgentVisible(true);
      }, 500); // Wait for fade out before changing agent
    }, 2000); // Change agent every 2 seconds

    return () => clearInterval(fadeTimer);
  }, [gameState]);

  // Timer effect
  useEffect(() => {
    if (gameState !== 'running') return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setGameState('exploded');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}${secs.toString().padStart(2, '0')}`;
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPin = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setPin(newPin);
    setShowError(false);

    if (newPin.length === 4) {
      setIsVerifying(true);
      setTimeout(() => {
        if (newPin === CORRECT_PIN) {
          setGameState('defused');
        } else {
          setWrongAttempts(prev => prev + 1);
          setShowError(true);
          setTimeout(() => {
            setPin('');
          }, 1000);
        }
        setIsVerifying(false);
      }, 1500);
    }
  };

  const startGame = () => {
    setIsExiting(true);
    setTimeout(() => {
      setGameState('running');
      setTimeLeft(INITIAL_TIME);
      setPin('');
      setWrongAttempts(0);
      setShowError(false);
      setIsExiting(false);
    }, 1000); // Match the welcomeExit animation duration
  };

  return (
    <div className="container">
      {gameState === 'welcome' && (
        <div className={`welcome-screen ${isExiting ? 'exit' : ''}`}>
          <div className="welcome-header">BOMFLEUR</div>
          <div className="welcome-subheader">IMF SECURITY SYSTEM</div>
          <div className="welcome-content">
            <div className="agent-list">
              <div className="agent-list-header">INITIALIZING AGENT:</div>
              <div className={`agent-name ${isAgentVisible ? 'visible' : ''}`}>
                {AGENTS[currentAgentIndex]}
              </div>
            </div>
            <div className="mission-brief">
              <div className="brief-line">MISSION STATUS: ACTIVE</div>
              <div className="brief-line">SECURITY LEVEL: MAXIMUM</div>
              <div className="brief-line">TIME LIMIT: 20:00</div>
              <div className="brief-line">OBJECTIVE: DEFUSE DEVICE</div>
            </div>
            <button className="start-button" onClick={startGame}>
              INITIALIZE MISSION
            </button>
          </div>
        </div>
      )}

      {gameState === 'running' && (
        <div className={`bomb-timer ${showError ? 'error-active' : ''}`}>
          {isVerifying && (
            <div className="verification-overlay">
              <div className="verification-content">
                <div className="verification-text">VERIFYING PIN CODE</div>
                <div className="verification-spinner"></div>
                <div className="verification-detail">ACCESSING SECURITY PROTOCOLS</div>
              </div>
            </div>
          )}
          <div className="security-label">IMF SECURITY SYSTEM</div>
          <div 
            className="time-display" 
            data-time-low={timeLeft < 60}
            data-content={formatTime(timeLeft)}
          >
            {formatTime(timeLeft).slice(0, 2)}
            <div className="time-separator">:</div>
            {formatTime(timeLeft).slice(2, 4)}
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(timeLeft / INITIAL_TIME) * 100}%` }}
              />
              <div className="progress-text">
                {`${Math.round((timeLeft / INITIAL_TIME) * 100)}%`}
              </div>
            </div>
          </div>
          <div className="pin-input">
            <div className="pin-label">ENTER DEACTIVATION CODE</div>
            <input
              type="text"
              value={pin}
              onChange={handlePinChange}
              placeholder="ENTER PIN"
              maxLength={4}
              autoFocus
            />
            {showError && (
              <div className="error-message">
                INCORRECT PIN CODE - RETRY ({wrongAttempts})
                <div className="error-detail">SECURITY PROTOCOL VIOLATION</div>
              </div>
            )}
          </div>
          <div className="security-footer">
            AUTHORIZED PERSONNEL ONLY - LEVEL 5 CLEARANCE REQUIRED
          </div>
        </div>
      )}

      {gameState === 'exploded' && (
        <div className="explosion">
          <div className="explosion-header">CRITICAL FAILURE</div>
          <div className="explosion-warning">
            <span className="warning-symbol">⚠</span>
            <h1>DETONATION SEQUENCE COMPLETE</h1>
            <span className="warning-symbol">⚠</span>
          </div>
          <div className="explosion-details">
            <div className="detail-line">MISSION STATUS: FAILED</div>
            <div className="detail-line">BOMB STATUS: DETONATED</div>
            <div className="detail-line">AGENT STATUS: TERMINATED</div>
            <div className="detail-line">AREA STATUS: COMPROMISED</div>
            <div className="detail-line attempts">FAILED ATTEMPTS: {wrongAttempts}</div>
            <div className="detail-line">INCIDENT REPORT: PENDING</div>
          </div>
          <div className="explosion-footer">EMERGENCY PROTOCOLS ACTIVATED</div>
        </div>
      )}

      {gameState === 'defused' && (
        <div className="success">
          <div className="classified-header">TOP SECRET</div>
          <div className="congratulations">CONGRATULATIONS AGENTS</div>
          <div className="mission-status">
            <div className="status-line">MISSION STATUS: COMPLETE</div>
            <div className="status-line">BOMB STATUS: DEFUSED</div>
            <div className="status-line">AGENT STATUS: ACTIVE</div>
            <div className="clearance">CLEARANCE LEVEL: ALPHA</div>
            <div className="timestamp">TIME REMAINING: {formatTime(timeLeft).slice(0, 2)}:{formatTime(timeLeft).slice(2, 4)}</div>
            <div className="attempts">FAILED ATTEMPTS: {wrongAttempts}</div>
          </div>
          <div className="classified-footer">IMF CLASSIFIED DOCUMENT</div>
        </div>
      )}
    </div>
  );
}

export default App
