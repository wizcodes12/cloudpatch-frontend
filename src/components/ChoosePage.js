import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Cloud } from 'lucide-react';
import '../styles/ChoosePage.css';
import authService from "../services/authService";

const ChoosePage = () => {
  const navigate = useNavigate();
  const [hoveredOption, setHoveredOption] = useState(null);

  const handleOptionSelect = (hostingType) => {
    navigate('/manual-check', { state: { hostingType } });
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
    </div>
  );
};

export default ChoosePage;