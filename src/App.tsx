import { useState, useEffect } from 'react'
import './App.css'

const INITIAL_TIME = 20 * 60; // 20 minutes in seconds
const CORRECT_PIN = '1234'; // You can change this to any 4-digit pin
const AGENT_NAMES = ['Faya', 'Otis', 'Eppo', 'Isa', 'Elli', 'Eliiot', 'Basil', 'Suzanne'];

function App() {
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [pin, setPin] = useState('');
  const [gameState, setGameState] = useState<'running' | 'exploded' | 'defused'>('running');
  const [showError, setShowError] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [agentName, setAgentName] = useState('');
  const [agentPosition, setAgentPosition] = useState({ x: 0, y: 0 });

  // Random agent name effect
  useEffect(() => {
    if (gameState !== 'running') return;

    const showRandomAgent = () => {
      const name = AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)];
      const x = Math.random() * 80; // Keep away from edges
      const y = Math.random() * 80;
      setAgentName(name);
      setAgentPosition({ x, y });

      setTimeout(() => {
        setAgentName('');
      }, 800); // Show for 800ms
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance to show a name
        showRandomAgent();
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPin = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setPin(newPin);
    setShowError(false); // Clear error when typing

    if (newPin.length === 4) {
      if (newPin === CORRECT_PIN) {
        setGameState('defused');
      } else {
        setWrongAttempts(prev => prev + 1);
        setShowError(true); // Show error message
        setTimeout(() => {
          setPin(''); // Clear PIN after a short delay
        }, 1000);
      }
    }
  };

  return (
    <div className="container">
      {agentName && (
        <div 
          className="agent-name"
          style={{ 
            left: `${agentPosition.x}%`, 
            top: `${agentPosition.y}%` 
          }}
        >
          {agentName}
        </div>
      )}
      {gameState === 'running' && (
        <div className={`bomb-timer ${showError ? 'error-active' : ''}`}>
          <div 
            className="time-display" 
            data-time-low={timeLeft < 60}
            data-content={formatTime(timeLeft)}
          >
            {formatTime(timeLeft)}
          </div>
          <div className="pin-input">
            <input
              type="text"
              value={pin}
              onChange={handlePinChange}
              placeholder="ENTER PIN CODE"
              maxLength={4}
              autoFocus
            />
            {showError && (
              <div className="error-message">
                INCORRECT PIN CODE - RETRY ({wrongAttempts})
              </div>
            )}
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
            <div className="timestamp">TIME REMAINING: {formatTime(timeLeft)}</div>
            <div className="attempts">FAILED ATTEMPTS: {wrongAttempts}</div>
          </div>
          <div className="classified-footer">IMF CLASSIFIED DOCUMENT</div>
        </div>
      )}
    </div>
  );
}

export default App
