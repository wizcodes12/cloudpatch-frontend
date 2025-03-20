// src/components/AuthRedirectPrompt.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/AuthRedirectPrompt.css';
import { FaGithub } from 'react-icons/fa';
import authService from "../services/authService";

const AuthRedirectPrompt = ({ onClose, returnTo }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {

    document.body.classList.add('blur-background');
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(interval);
          // Replace localhost:5000 with your deployed backend URL
          const redirectUrl = returnTo
          ? `https://cloudpatch-backend-js.onrender.com/auth/github?returnTo=${encodeURIComponent(returnTo)}`
          : "https://cloudpatch-backend-js.onrender.com/auth/github";
          window.location.href = redirectUrl;
          return 100;
        }
        return newProgress;
      });
    }, 30);

    // Remove blur class when component unmounts
    return () => {
      clearInterval(interval);
      document.body.classList.remove('blur-background');
    };
  }, [returnTo]);
  
  return (
    <motion.div
    className="auth-redirect-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
      <motion.div 
        className="auth-redirect-modal"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="modal-content">
          <div className="github-logo-container">
            <FaGithub className="github-logo" />
          </div>
          
          <h2 className="redirect-title">Connecting to GitHub</h2>
          <p className="redirect-message">
            We're preparing to connect to GitHub for secure authentication.
            This allows CloudPatch.AI to access your repositories for analysis.
          </p>
          
          <div className="progress-container">
            <div 
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="progress-text">
            {progress <100 ? 'Initializing secure connection...' : 'Redirecting...'}
          </p>
          
          <div className="auth-details">
            <p className="auth-detail"><span>✓</span> Secure OAuth 2.0 Protocol</p>
            <p className="auth-detail"><span>✓</span> Repository Access Only</p>
            <p className="auth-detail"><span>✓</span> No Password Storage</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthRedirectPrompt;