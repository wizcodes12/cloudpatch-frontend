// src/components/HomePage.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import '../styles/HomePage.css';
import AuthRedirectPrompt from "./AuthRedirectPrompt";
import authService from "../services/authService";

const HomePage = ({ user }) => {
  const titleRef = useRef(null);
  const navigate = useNavigate();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    const animateText = () => {
      const titleElement = titleRef.current;
      if (!titleElement) return;
  
      const letters = "CloudPatch.Ai".split("");
      titleElement.textContent = ""; // Clear existing text
  
      letters.forEach((letter, i) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.animationDelay = `${i * 0.1}s`;
        span.className = "gradient-letter-hp";
        titleElement.appendChild(span);
      });
    };
  
    animateText(); // Run once initially
  
    // Run animation every 3 seconds (adjust timing if needed)
    const interval = setInterval(() => {
      animateText();
    }, 3000);
  
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);
  
  const handleFixNow = () => {
    if (user) {
      navigate('/ChoosePage');
    } else {
      // Show the auth prompt instead of immediate redirect
      setShowAuthPrompt(true);
    }
  };

  const features = [
    {
      title: "API Endpoint Scanner",
      description: "Scans API endpoints for errors, security issues, and performance bottlenecks",
      icon: "🔍"
    },
    {
      title: "Intelligent Analysis",
      description: "Analyzes API responses to extract stack traces, potential causes, and solutions",
      icon: "🧠"
    },
    {
      title: "Automatic Fixes",
      description: "Uses AI models to suggest and apply automatic fixes",
      icon: "🛠️"
    },
    {
      title: "Professional Reporting",
      description: "Generates comprehensive PDF reports for developers",
      icon: "📊"
    },
    {
      title: "Security Checks",
      description: "Performs deep security checks for SSL, authentication, and API vulnerabilities",
      icon: "🔒"
    },
    {
      title: "Performance Monitoring",
      description: "Monitors API performance and provides optimization recommendations",
      icon: "📈"
    },
    {
      title: "Authentication",
      description: "Handles user authentication via GitHub OAuth",
      icon: "🔑"
    },
    {
      title: "Code Analysis",
      description: "Supports file-based API detection and code analysis",
      icon: "📝"
    }
  ];

  return (
    <div className="home-page-hp">
      <div className="background-effects-hp"></div>
      <div className="content-container-hp">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content-hp"
        >
          <h1 className="main-heading-hp" ref={titleRef}>
            CloudPatch Ai
          </h1>

          <motion.div
            className="error-card1-hp"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="error-title-hp">Ran into an error?</h2>
            <p className="error-description-hp">
              Our AI-powered system detects and fixes backend issues in real-time,
              ensuring seamless operation of your applications.
            </p>
            <button onClick={handleFixNow} className="action-button-hp">
              <span>Try Now</span>
            </button>
          </motion.div>

          <motion.div 
            className="features-section-hp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 className="features-title-hp">What CloudPatch.Ai Does</h2>
            <div className="features-grid-hp">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card-hp"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 8px 24px rgba(137, 207, 240, 0.3)"
                  }}
                >
                  <span className="feature-icon-hp">{feature.icon}</span>
                  <h3 className="feature-title-hp">{feature.title}</h3>
                  <p className="feature-description-hp">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Auth redirect prompt */}
      {showAuthPrompt && (
        <AuthRedirectPrompt 
          onClose={() => setShowAuthPrompt(false)} 
          returnTo="/"
        />
      )}
    </div>
  );
};

export default HomePage;