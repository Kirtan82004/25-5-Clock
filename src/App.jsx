import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);

  useEffect(() => {
    setTimeLeft(sessionLength * 60);
  }, [sessionLength]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(1500);
    setIsSession(true);
    const beep = document.getElementById('beep');
    beep.pause();
    beep.currentTime = 0;
  };

  const handleIncrementDecrement = (type, action) => {
    if (type === 'break') {
      if (action === 'increment' && breakLength < 60) setBreakLength(breakLength + 1);
      if (action === 'decrement' && breakLength > 1) setBreakLength(breakLength - 1);
    } else if (type === 'session') {
      if (action === 'increment' && sessionLength < 60) setSessionLength(sessionLength + 1);
      if (action === 'decrement' && sessionLength > 1) setSessionLength(sessionLength - 1);
    }
  };

  useEffect(() => {
    let timer = null;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            const beep = document.getElementById('beep');
            beep.play();
            if (isSession) {
              setIsSession(false);
              return breakLength * 60;
            } else {
              setIsSession(true);
              return sessionLength * 60;
            }
          } else {
            return prev - 1;
          }
        });
      }, 1000);
    } else if (!isRunning && timeLeft !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isSession, breakLength, sessionLength]);

  return (
    <div id="pomodoro">
      <div className="container">
        <h1>Pomodoro Timer</h1>
        <div className="settings">
          <div className="break">
            <h2 id="break-label">Break Length</h2>
            <div className="controls">
              <button id="break-decrement" onClick={() => handleIncrementDecrement('break', 'decrement')}>-</button>
              <span id="break-length">{breakLength}</span>
              <button id="break-increment" onClick={() => handleIncrementDecrement('break', 'increment')}>+</button>
            </div>
          </div>
          <div className="session">
            <h2 id="session-label">Session Length</h2>
            <div className="controls">
              <button id="session-decrement" onClick={() => handleIncrementDecrement('session', 'decrement')}>-</button>
              <span id="session-length">{sessionLength}</span>
              <button id="session-increment" onClick={() => handleIncrementDecrement('session', 'increment')}>+</button>
            </div>
          </div>
        </div>
        <div className="timer">
          <h2 id="timer-label">{isSession ? 'Session' : 'Break'}</h2>
          <div id="time-left">{formatTime(timeLeft)}</div>
        </div>
        <div className="controls">
          <button id="start_stop" onClick={handleStartStop}>
            {isRunning ? 'Stop' : 'Start'}
          </button>
          <button id="reset" onClick={handleReset}>Reset</button>
        </div>
        <audio id="beep" src="https://www.soundjay.com/button/beep-07.wav"></audio>
      </div>
    </div>
  );
};

export default App;
