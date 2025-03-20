import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaArrowRight, FaCopy } from 'react-icons/fa';
import "../styles/DocsPage.css";

const DocsPage = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
  //leave this empty
  ];

  const steps = [
   
    {
      title: "Authentication",
      description: "Sign in with your GitHub account to enable repository scanning and automatic fixes.",
      code: null
    },
    {
      title: "Select Scan Type",
      description: "Choose between GitHub repository scanning or manual API endpoint checking.",
      code: null
    },
    {
      title: "Connect Your API",
      description: "Enter your API URL below. Make sure it includes the /api/ path:",
      code: "https://your-backend.com/api/"
    },
    {
      title: "Review Results",
      description: "View detailed analysis of your API, including security issues, performance metrics, and suggested fixes.",
      code: null
    }
  ];

  return (
    <div className="docs-page">
      <motion.div 
        className="docs-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }} // Slower animation
      >
        &ensp;
        <h1 className="docs-title">CloudPatch.AI Documentation</h1>
        <p className="docs-subtitle">Your AI-powered API testing and fixing solution</p>
      </motion.div>

      <motion.section 
        className="docs-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }} // Slower animation with slightly longer delay
      >
        {/* <h2>Features</h2> */}
        {/* <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FaCheck className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div> */}
      </motion.section>

      <motion.section 
        className="docs-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }} // Slower animation with longer delay
      >
        <h2>Getting Started</h2>
        <div className="steps-container">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="step-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.2 + 0.8, // Longer delay between steps
                duration: 0.7 // Slower animation
              }}
            >
              <div className="step-number">{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {step.code && (
                <div className="code-block">
                  <code>{step.code}</code>
                  <button 
                    className="copy-button"
                    onClick={() => handleCopy(step.code)}
                  >
                    {copied ? 'Copied!' : <FaCopy />}
                  </button>
                </div>
              )}
              {/* {index === 0 && (
                <div className="api-input-container">
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="Enter your API URL"
                    className="api-input"
                  />
                  <button 
                    className="validate-button" 
                    disabled={true} // Make button unclickable
                    style={{ 
                      opacity: 0.6, 
                      cursor: 'not-allowed' 
                    }} // Visual feedback that button is disabled
                  >
                    Validate <FaArrowRight />
                  </button>
                </div>
              )} */}
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default DocsPage;