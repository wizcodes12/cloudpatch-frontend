import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaCode } from 'react-icons/fa';
import "../styles/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="footer-content">
        <div className="footer-top">
          <motion.div 
            className="footer-brand-container"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="brand-box">
              <div className="logo-wrapper">
                <img 
                  src="/Main_logo.png" 
                  alt="CloudPatch.AI Logo" 
                  className="footer-logo"
                />
              </div>
              {/* <div className="brand-divider" /> */}
              {/* <span className="gradient-text">CloudPatch.AI</span> */}
            </div>
          </motion.div>
          
          <div className="footer-links">
            <motion.a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="footer-link"
            >
              <FaGithub /> GitHub
            </motion.a>
            <motion.div 
              className="divider"
              animate={{ 
                height: [0, 20],
                opacity: [0, 1] 
              }}
              transition={{ duration: 0.5 }}
            />
            <motion.span 
              className="created-by"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCode /> Created by WizCodes
            </motion.span>
          </div>
        </div>
        
        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="copyright">
            <span>© {currentYear} CloudPatch.AI</span>
            <span className="separator">|</span>
            <span>All rights reserved</span>
            <span className="separator">|</span>
            <span>Empowering developers with AI</span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;