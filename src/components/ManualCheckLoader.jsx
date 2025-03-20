import React, { useState, useEffect } from 'react';
import { Loader, AlertTriangle } from 'lucide-react';
import '../styles/ManualCheckLoader.css';

const GitHubIcon = () => (
  <svg className="github-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const PdfIcon = () => (
  <svg className="pdf-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
    <path d="M14,2H6C4.9,2 4,2.9 4,4V20C4,21.1 4.9,22 6,22H18C19.1,22 20,21.1 20,20V8L14,2M18,20H6V4H13V9H18V20M10.92,12.31C10.68,11.54 10.15,9.88 10.65,9.17C11.2,8.39 12.32,9.33 12.58,9.75C12.91,10.26 12.36,10.68 12.36,11.17C12.36,11.8 12.89,11.82 13.15,12.11C13.84,13 12.24,14.11 11.5,14.8C11.06,14.28 10.19,13.23 9.84,12.61C10.97,12.67 11.73,12.41 11.73,12.06C11.73,11.77 11.23,11.5 10.92,12.31Z"/>
  </svg>
);

const ManualCheckLoader = ({ type, onClose, showPopupBlocked = false, onAllowPopups }) => {
  const [loadingMessage, setLoadingMessage] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  // Define loading messages based on activity type
  const loadingMessages = {
    scanning: [
      "Analyzing your API endpoint...",
      "Looking for potential vulnerabilities...",
      "Checking API response patterns...",
      "Validating request structure...",
      "Almost there, compiling results..."
    ],
    'applying-fix': [
      "Connecting to GitHub...",
      "Analyzing code structure...",
      "Preparing suggested fix...",
      "Setting up repository access...",
      "Almost ready to apply changes..."
    ],
    'generating-pdf': [
      "Generating your PDF report...",
      "Compiling issue details...",
      "Formatting document...",
      "Adding recommendations...",
      "Finalizing your report..."
    ]
  };

  // Set default messages for any unspecified types
  const defaultMessages = [
    "Processing your request...",
    "Almost there...",
    "Working on it..."
  ];

  // Determine which messages to use
  const messages = loadingMessages[type] || defaultMessages;
  
  // Cycle through messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);
    
    return () => clearInterval(messageInterval);
  }, [messages]);
  
  // Update the message whenever the currentMessageIndex changes
  useEffect(() => {
    setLoadingMessage(messages[currentMessageIndex]);
  }, [currentMessageIndex, messages]);

  // Determine title and icon based on type
  let title, icon;
  switch(type) {
    case 'scanning':
      title = "Scanning your API";
      icon = <Loader className="loading-prompt-icon spin" size={40} />;
      break;
    case 'applying-fix':
      title = "Preparing GitHub Fix";
      icon = <GitHubIcon />;
      break;
    case 'generating-pdf':
      title = "Generating Report";
      icon = <PdfIcon />;
      break;
    default:
      title = "Processing";
      icon = <Loader className="loading-prompt-icon spin" size={40} />;
  }

  return (
    <div className="loading-prompt-overlay" onClick={onClose}>
      <div className="loading-prompt-container" onClick={e => e.stopPropagation()}>
        <div className="icon-container">
          {icon}
        </div>
        <h3 className="loading-prompt-title">{title}</h3>
        <p className="loading-prompt-message">{loadingMessage}</p>
       
        <div className="loading-prompt-spinner-container">
          <div className="loading-prompt-spinner">
            <div className="spinner-inner"></div>
          </div>
        </div>
       
        {showPopupBlocked && (
          <div className="popup-blocked-notification">
            <AlertTriangle size={20} />
            <span className="popup-notification-message">
              Popup was blocked by your browser.
            </span>
            <button
              className="popup-notification-button"
              onClick={onAllowPopups}
            >
              Allow
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualCheckLoader;