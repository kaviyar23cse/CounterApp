import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [laps, setLaps] = useState([]);
  const [target, setTarget] = useState('');
  const [timedOut, setTimedOut] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const updated = prev + 1;

          // Parse target time and compare
          const parts = target.split(':');
          if (parts.length === 3) {
            const targetSeconds = (+parts[0]) * 3600 + (+parts[1]) * 60 + (+parts[2]);
            if (updated === targetSeconds && !timedOut) {
              try {
                const audio = new Audio('/beep.wav'); // ✅ Make sure file is in /public
                audio.play().catch(() => console.log('Audio blocked or failed.'));
              } catch (e) {
                console.log('Audio load/play error');
              }
              alert('🎯 Target time reached!');
              setTimedOut(true);
              setIsRunning(false); // 🛑 Stop timer after target is hit
            }
          }

          return updated;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, target, timedOut]);

  const formatTime = (secs) => {
    const hrs = String(Math.floor(secs / 3600)).padStart(2, '0');
    const mins = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${hrs}:${mins}:${s}`;
  };

  const handleLap = () => {
    setLaps([...laps, formatTime(seconds)]);
  };

  const handleTargetChange = (e) => {
    const value = e.target.value;
    setTarget(value);

    // 🧪 Basic validation (HH:MM:SS)
    const valid = /^(\d{2}):(\d{2}):(\d{2})$/.test(value);
    if (!valid && value.length >= 8) {
      alert("⚠️ Please enter a valid time in HH:MM:SS format");
    }
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      <div className="content-box">
        <h1>⏱ Timer App</h1>

        <h2 className="timer">{formatTime(seconds)}</h2>

        <div className="controls">
          <button className="btn start" onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button className="btn reset" onClick={() => {
            setSeconds(0);
            setIsRunning(false);
            setTimedOut(false);
          }}>
            Reset
          </button>
          <button className="btn lap" onClick={handleLap}>
            Lap
          </button>
          <button className="btn mode" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <div className="target-input">
          <label>🎯 Set Target Time (HH:MM:SS):</label>
          <input
            type="text"
            value={target}
            onChange={handleTargetChange}
            placeholder="00:00:10"
            pattern="\d{2}:\d{2}:\d{2}" // enables :invalid CSS state
          />
        </div>

        <h3 className="lap-heading">🏁 Lap Times</h3>

        {laps.length > 0 && (
          <div className="lap-scroll">
            <ul>
              {laps.map((lap, i) => (
                <li key={i}>🕒 Lap {i + 1}: {lap}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
