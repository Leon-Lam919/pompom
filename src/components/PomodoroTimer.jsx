import React, { useState, useEffect, useRef } from 'react';
import './PomodoroTimer.css'; // External CSS file for enhanced styling


const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(1500); // Default 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false); // To manage if the timer is running
  const [isPaused, setIsPaused] = useState(false); // To manage pause state
  const [customTime, setCustomTime] = useState(25); // Custom time in minutes
  const [theme, setTheme] = useState('light'); // Theme state
  const [topic, setTopic] = useState(''); // Topic (task) state
  const [taskTimes, setTaskTimes] = useState({}); // Store total time spent on tasks
  const [isBreak, setIsBreak] = useState(false); // State to track if it's break time

  // Apply the theme to the body element whenever the theme changes
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : 'light'; // Apply theme class to body
  }, [theme]);

  // Manage the timer countdown
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0 && !isPaused) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
      setIsRunning(false);

      // After a session ends, add time to the current topic/task
      if (!isBreak) {
        trackTimeSpentOnTask();
        setIsBreak(true);
        setTimeLeft(300); // Set to 5 minutes break
      } else {
        setIsBreak(false);
        setTimeLeft(customTime * 60); // Set back to custom work time
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isBreak, customTime, isPaused]);

  // Function to track time spent on tasks
  const trackTimeSpentOnTask = () => {
    const timeSpent = customTime * 60 - timeLeft; // Time spent in seconds
    if (topic.trim()) {
      setTaskTimes((prevTaskTimes) => {
        const totalTime = prevTaskTimes[topic] || 0;
        return {
          ...prevTaskTimes,
          [topic]: totalTime + timeSpent,
        };
      });
    }
  };

  // Start the timer
  const startTimer = () => {
    setTimeLeft(customTime * 60); // Set timeLeft to custom time in seconds
    setIsRunning(true);
    setIsPaused(false); // Ensure it's not paused
  };

  // Pause the timer
  const pauseTimer = () => {
    setIsPaused(true);
  };

  // Stop the timer and reset time
  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(customTime * 60); // Reset to custom time
    setIsPaused(false);
  };

  // Reset the timer without stopping it
  const resetTimer = () => {
    setTimeLeft(customTime * 60); // Reset to custom time
    setIsPaused(false);
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Progress percentage for progress bar
  const progressPercentage = ((customTime * 60 - timeLeft) / (customTime * 60)) * 100;

  return (
    <div className="pomodoro-container">
      <h1 className="title">Pomodoro Timer</h1>

      {/* Timer Input and Progress */}
      <div className="timer-section">
        <input
          className="topic-input"
          type="text"
          placeholder="Enter Task"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <div className={`timer ${isBreak ? 'break' : ''}`}>
          <p>{isBreak ? 'Break Time' : 'Work Time'}: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}</p>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="button-group">
          <button onClick={startTimer} className="btn btn-start">Start</button>
          <button onClick={pauseTimer} className="btn btn-pause">Pause</button>
          <button onClick={stopTimer} className="btn btn-stop">Stop</button>
          <button onClick={resetTimer} className="btn btn-reset">Reset</button>
        </div>
        <div className="custom-time-input">
          <label htmlFor="custom-time">Set Timer (minutes): </label>
          <input
            id="custom-time"
            type="number"
            value={customTime}
            onChange={(e) => setCustomTime(Number(e.target.value))}
          />
        </div>

        {/* Enhanced Theme Toggle */}
        <div className="theme-toggle">
          <button className="btn-theme" onClick={toggleTheme}>
            {theme === 'light' ? (
              <span className="toggle-icon sun">☀️</span>
            ) : (
              <span className="toggle-icon moon">🌙</span>
            )}
          </button>
        </div>

        {/* Hidden YouTube Player */}
        <div id="youtube-player" className="hidden-player"></div>

        {/* Task Time Tracker */}
        <div className="task-time-tracker">
          <h3>Time Spent on Tasks</h3>
          <ul>
            {Object.keys(taskTimes).map((task) => (
              <li key={task}>
                {task}: {Math.floor(taskTimes[task] / 60)} minutes {taskTimes[task] % 60} seconds
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
