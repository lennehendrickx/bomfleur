import { useState, useEffect } from 'react'
import './App.css'

const INITIAL_TIME = 20 * 60; // 20 minutes in seconds
const CORRECT_PIN = '1234'; // You can change this to any 4-digit pin
const AGENTS = ['Faya', 'Otis', 'Eppo', 'Isa', 'Ellie', 'Elliot', 'Basil', 'Suzanne'];

const translations = {
  welcomeHeader: 'BOMFLEUR',
  securitySystem: 'BOMFLEUR BEVEILIGINGSSYSTEEM',
  initializingAgent: 'AGENT INITIALISEREN:',
  missionStatus: 'MISSIE STATUS: ACTIEF',
  securityLevel: 'BEVEILIGINGSNIVEAU: MAXIMUM',
  timeLimit: 'TIJDSLIMIET: 20:00',
  objective: 'DOEL: BOMINACTIVATIE',
  initializeMission: 'START MISSIE',
  verifyingPin: 'PIN CODE VERIFIËREN',
  accessingProtocols: 'BEVEILIGINGSPROTOCOLLEN LADEN',
  enterDeactivationCode: 'VOER DEACTIVATIE CODE IN',
  enterPin: '4 CIJFERS',
  incorrectPin: 'ONJUISTE PIN CODE - PROBEER OPNIEUW',
  securityViolation: 'BEVEILIGINGSPROTOCOL OVERTREDING',
  authorizedPersonnel: 'ALLEEN GEAUTORISEERD PERSONEEL - NIVEAU 5 TOEGANG VEREIST',
  criticalFailure: 'KRITIEKE FOUT',
  detonationComplete: 'DETONATIE VOLTOOID',
  missionFailed: 'MISSIE STATUS: MISLUKT',
  bombDetonated: 'BOM STATUS: GEDETONEERD',
  agentTerminated: 'AGENT STATUS: UITGESCHAKELD',
  areaCompromised: 'GEBIED STATUS: GECOMPROMITTEERD',
  failedAttempts: 'MISLUKTE POGINGEN:',
  incidentReport: 'INCIDENT RAPPORT: IN AFWACHTING',
  emergencyProtocols: 'NOODPROTOCOLLEN GEACTIVEERD',
  topSecret: 'STRIKT GEHEIM',
  congratulations: 'GEFELICITEERD AGENTEN',
  missionComplete: 'MISSIE STATUS: VOLTOOID',
  bombDefused: 'BOM STATUS: ONSCHADELIJK GEMAAKT',
  agentActive: 'AGENT STATUS: ACTIEF',
  clearanceLevel: 'TOEGANGSNIVEAU: ALPHA',
  timeRemaining: 'RESTERENDE TIJD:',
  classifiedDoc: 'VERTROUWELIJK DOCUMENT'
};

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
          <div className="welcome-header">{translations.welcomeHeader}</div>
          <div className="welcome-subheader">{translations.securitySystem}</div>
          <div className="welcome-content">
            <div className="agent-list">
              <div className="agent-list-header">{translations.initializingAgent}</div>
              <div className={`agent-name ${isAgentVisible ? 'visible' : ''}`}>
                {AGENTS[currentAgentIndex]}
              </div>
            </div>
            <div className="mission-brief">
              <div className="brief-line">{translations.missionStatus}</div>
              <div className="brief-line">{translations.securityLevel}</div>
              <div className="brief-line">{translations.timeLimit}</div>
              <div className="brief-line">{translations.objective}</div>
            </div>
            <button className="start-button" onClick={startGame}>
              {translations.initializeMission}
            </button>
          </div>
        </div>
      )}

      {gameState === 'running' && (
        <div className={`bomb-timer ${showError ? 'error-active' : ''}`}>
          {isVerifying && (
            <div className="verification-overlay">
              <div className="verification-content">
                <div className="verification-text">{translations.verifyingPin}</div>
                <div className="verification-spinner"></div>
                <div className="verification-detail">{translations.accessingProtocols}</div>
              </div>
            </div>
          )}
          <div className="security-label">{translations.securitySystem}</div>
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
            <div className="pin-label">{translations.enterDeactivationCode}</div>
            <input
              type="text"
              value={pin}
              onChange={handlePinChange}
              placeholder={translations.enterPin}
              maxLength={4}
              autoFocus
            />
            {showError && (
              <div className="error-message">
                {translations.incorrectPin} ({wrongAttempts})
                <div className="error-detail">{translations.securityViolation}</div>
              </div>
            )}
          </div>
          <div className="security-footer">
            {translations.authorizedPersonnel}
          </div>
        </div>
      )}

      {gameState === 'exploded' && (
        <div className="explosion">
          <div className="explosion-header">{translations.criticalFailure}</div>
          <div className="explosion-warning">
            <span className="warning-symbol">⚠</span>
            <h1>{translations.detonationComplete}</h1>
            <span className="warning-symbol">⚠</span>
          </div>
          <div className="explosion-details">
            <div className="detail-line">{translations.missionFailed}</div>
            <div className="detail-line">{translations.bombDetonated}</div>
            <div className="detail-line">{translations.agentTerminated}</div>
            <div className="detail-line">{translations.areaCompromised}</div>
            <div className="detail-line attempts">{translations.failedAttempts} {wrongAttempts}</div>
            <div className="detail-line">{translations.incidentReport}</div>
          </div>
          <div className="explosion-footer">{translations.emergencyProtocols}</div>
        </div>
      )}

      {gameState === 'defused' && (
        <div className="success">
          <div className="classified-header">{translations.topSecret}</div>
          <div className="congratulations">{translations.congratulations}</div>
          <div className="mission-status">
            <div className="status-line">{translations.missionComplete}</div>
            <div className="status-line">{translations.bombDefused}</div>
            <div className="status-line">{translations.agentActive}</div>
            <div className="clearance">{translations.clearanceLevel}</div>
            <div className="timestamp">{translations.timeRemaining} {formatTime(timeLeft).slice(0, 2)}:{formatTime(timeLeft).slice(2, 4)}</div>
            <div className="attempts">{translations.failedAttempts} {wrongAttempts}</div>
          </div>
          <div className="classified-footer">{translations.classifiedDoc}</div>
        </div>
      )}
    </div>
  );
}

export default App
