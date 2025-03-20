// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaGithub, FaCaretDown } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
import "../styles/Navbar.css";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub, FaCaretDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import authService from "../services/authService";

const Navbar = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }
  };

  const handleViewRepos = () => {
    navigate('/dashboard');
    setShowDropdown(false);
  };

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Download", path: "/download" },
    { title: "Docs", path: "/docs" },
    { title: "Help", path: "/help" }
  ];

  const handleGitHubLogin = (e) => {
    e.preventDefault();
    const currentPath = window.location.pathname;
    
    // Get the current origin (handles both localhost and production)
    const currentOrigin = window.location.origin;
    
    const redirectUrl = `https://cloudpatch-backend-js.onrender.com/auth/github?returnTo=${encodeURIComponent(currentPath)}&redirectUri=${encodeURIComponent(currentOrigin)}`;
    window.location.href = redirectUrl;
  };

  return (
    <nav className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <motion.div 
            className="logo-brand-container"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="logo-box">
              <div className="logo-wrapper">
                <img 
                  src="/Main_logo.png" 
                  alt="CloudPatch.AI Logo" 
                  className="nav-logo"
                />
              </div>
              <div className="logo-divider" />
              <div className="logo-text">
                <span className="logo__gradient">CloudPatch </span>
                <span className="logo__dot">&nbsp;Ai</span>
              </div>
            </div>
          </motion.div>
        </Link>

        <div className="navbar__links">
          {navLinks.map((link) => (
            <motion.div
              key={link.title}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={link.path} className="nav__link">
                {link.title}
                <div className="nav__link-indicator" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="navbar__right">
          {!user ? (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              onClick={handleGitHubLogin}
              className="github__button"
            >
              <div className="github__button-content">
                <FaGithub className="github__icon" />
                <span>Sign in with GitHub</span>
              </div>
              <div className="button__glow" />
            </motion.a>
          ) : (
            <div className="user__profile" ref={dropdownRef}>
              <motion.div
                className="profile__badge"
                onClick={() => setShowDropdown(!showDropdown)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="profile__image-wrapper">
                  <div className="profile__image-container">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="profile__image"
                    />
                    <div className="profile__status-indicator" />
                  </div>
                  <div className="profile__image-glow" />
                </div>
                <span className="profile__name">{user.username}</span>
                <motion.div
                  animate={{ rotate: showDropdown ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaCaretDown className="dropdown__chevron" />
                </motion.div>
              </motion.div>
              
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    className="profile__dropdown"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {/* <button
                      onClick={handleViewRepos}
                      className="dropdown__button"
                    >
                      View My Repos
                    </button> */}
                    <button
                      onClick={onLogout}
                      className="logout__button"
                    >
                      <span>Sign Out</span>
                      <div className="button__glow" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;