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
              <svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" className="windows-logo">
                <path d="M0 12.5L35.7 7.1V42.1H0V12.5Z" fill="#F25022"/>
                <path d="M39.8 6.5L88 0V41.5H39.8V6.5Z" fill="#7FBA00"/>
                <path d="M0 45.9H35.7V80.9L0 75.5V45.9Z" fill="#00A4EF"/>
                <path d="M39.8 46.5H88V88L39.8 81.5V46.5Z" fill="#FFB900"/>
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
