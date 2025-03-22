import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Cloud, X } from 'lucide-react';
import '../styles/ChoosePage.css';
import authService from "../services/authService";

const ChoosePage = () => {
  const navigate = useNavigate();
  const [hoveredOption, setHoveredOption] = useState(null);
  const [showLocalModal, setShowLocalModal] = useState(false);

  useEffect(() => {
    let timer;
    if (showLocalModal) {
      timer = setTimeout(() => {
        setShowLocalModal(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showLocalModal]);

  const handleOptionSelect = (hostingType) => {
    if (hostingType === 'local') {
      setShowLocalModal(true);
    } else {
      navigate('/manual-check', { state: { hostingType } });
    }
  };

  return (
    <div className="choose-page">
      <div className="choose-container">
        <div className="choose-header">
          <h1>Choose Your Method</h1>
          <p>Select the appropriate hosting environment for your API check</p>
        </div>
        <div className="options-container">
          <div
            className={`option-card ${hoveredOption === 'local' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredOption('local')}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={() => handleOptionSelect('local')}
          >
            <div className="option-icon">
              <Server size={50} />
            </div>
            <h2>Local Hosted</h2>
            <p>Check APIs running on your local development server</p>
            <ul className="option-features">
              <li>Scan endpoints using your local port number</li>
              <li>Support for HTTP and HTTPS protocols</li>
              <li>Test APIs without deploying</li>
              <li>Detailed error analysis</li>
              <li><span className="feature-unavailable">Auto-fix unavailable</span></li>
            </ul>
            <div className="select-button">
              Select
            </div>
          </div>
          <div
            className={`option-card ${hoveredOption === 'cloud' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredOption('cloud')}
            onMouseLeave={() => setHoveredOption(null)}
            onClick={() => handleOptionSelect('cloud')}
          >
            <div className="option-icon">
              <Cloud size={50} />
            </div>
            <h2>Cloud Hosted</h2>
            <p>Check APIs deployed to cloud environments</p>
            <ul className="option-features">
              <li>Scan any online API endpoint</li>
              <li>Analyze publicly accessible APIs</li>
              <li>Integration with GitHub repositories</li>
              <li>Detailed error analysis</li>
              <li><span className="feature-available">Auto-fix available</span></li>
            </ul>
            <div className="select-button">
              Select
            </div>
          </div>
        </div>
      </div>

      {/* Local Endpoint Modal */}
      {showLocalModal && (
        <div className="local-modal-overlay" onClick={() => setShowLocalModal(false)}>
          <div className="local-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowLocalModal(false)}>
              <X size={24} />
            </button>
            <div className="modal-logo">
              <svg viewBox="0 0 100 100" className="exe-logo" xmlns="http://www.w3.org/2000/svg">
                {/* Desktop/App icon circle background */}
                <circle cx="50" cy="50" r="45" fill="url(#appGradient)" />
                
                {/* Desktop icon */}
                <rect x="25" y="25" width="50" height="35" rx="3" fill="#FFFFFF" />
                <rect x="30" y="30" width="40" height="25" rx="1" fill="#0a2f6c" />
                
                {/* Download arrow */}
                <path d="M50 68 L50 90" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
                <path d="M35 75 L50 90 L65 75" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="appGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e4586" />
                    <stop offset="100%" stopColor="#0d2659" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="modal-content">
              <h2>Local Endpoint Scanning</h2>
              <p>Local endpoint scanning will be available when CloudPatch Desktop App is launched.</p>
              <p>We're working hard to bring this feature to you soon. Please stay tuned!</p>
              <div className="loading-indicator">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChoosePage;
