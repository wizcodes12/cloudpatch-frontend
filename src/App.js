import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Github } from "lucide-react"; 
import authService from './services/authService';
import styled from "styled-components";

import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Toast from "./components/Toast";
import "./App.css";
import ChoosePage from "./components/ChoosePage";
import ManualCheck from "./components/ManualCheck";
import Footer from "./components/Footer";
import DocsPage from "./components/DocsPage";
import HelpPage from './components/HelpPage';
import NotFoundPage from './components/NotFoundPage';
import DownloadPage from './components/DownloadPage';
import MobileErrorPage from './components/MobileErrorPage';

// Styled Components with reduced neon effects
const AuthOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const AuthModal = styled.div`
  width: 500px;
  max-width: 90%;
  background: linear-gradient(135deg, #1a1c2e, #2a2f4c);
  border-radius: 16px;
  padding: 32px;
  position: relative;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2),
              0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #3498db, #1e88e5);
    border-radius: 18px;
    z-index: -1;
    opacity: 0.3;
    filter: blur(8px);
  }
`;

const IconContainer = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #2b3452, #3d4976);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const AuthTitle = styled.h2`
  color: white;
  font-size: 22px;
  text-align: center;
  margin-bottom: 12px;
  font-weight: 600;
`;

const AuthMessage = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.5;
`;

const SignInButton = styled.button`
  background: linear-gradient(90deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
  display: block;
  margin: 0 auto;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
  }
`;

function App() {
  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const API_BASE_URL = "https://cloudpatch-backend-py.onrender.com";

  useEffect(() => {
    // Check if the device is mobile
    const checkMobileDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      
      // Regular expressions to check for mobile devices
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      
      // Set mobile state based on user agent
      setIsMobileDevice(mobileRegex.test(userAgent));
    };

    checkMobileDevice();

    // Check for authentication
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userDataStr = params.get('userData');
    const returnTo = params.get('returnTo');

    if (token && userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        authService.setAuthState(token, userData);
        setUser(userData);
        const cleanUrl = returnTo || '/';
        window.history.replaceState({}, '', cleanUrl);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      const userData = authService.getUser();
      setUser(userData);
    }
  }, []);

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const onLogout = async () => {
    try {
      console.log("Attempting logout to:", `${authService.AUTH_BASE_URL}/api/logout`);
      
      // Try server-side logout
      try {
        const response = await fetch(`${authService.AUTH_BASE_URL}/api/logout`, {
          method: 'GET',
          credentials: 'include',
          mode: 'cors',  // Explicitly set mode
          headers: {
            'Accept': 'application/json'
          }
        });
        
        console.log("Logout response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("Logout response:", data);
        }
      } catch (serverError) {
        console.warn("Server logout failed (continuing with local logout):", serverError);
      }
      
      // Always clear local auth state, even if server logout fails
      authService.clearAuthState();
      setUser(null);
      showNotification("You have been logged out successfully", "success");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      
      // Fallback: Force local logout
      authService.clearAuthState();
      setUser(null);
      showNotification("Logged out locally", "warning");
      window.location.href = "/";
    }
  };

  const handleSignIn = () => {
    sessionStorage.setItem('redirectAfterAuth', window.location.pathname);
    window.location.href = "/";
  };

  const AuthPrompt = () => (
    <AuthOverlay>
      <AuthModal>
        <IconContainer>
          <Github size={24} color="white" />
        </IconContainer>
        <AuthTitle>Authentication Required</AuthTitle>
        <AuthMessage>
          Please sign in to access this page. Your changes will be saved and you'll be redirected back after signing in.
        </AuthMessage>
        <SignInButton onClick={handleSignIn}>
          Sign In to Continue
        </SignInButton>
      </AuthModal>
    </AuthOverlay>
  );

  const renderProtectedRoute = (Component, props) => {
    if (!user) {
      return <AuthPrompt />;
    }
    
    return (
      <Component
        {...props}
        user={user}
        API_BASE_URL={API_BASE_URL}
        showNotification={showNotification}
      />
    );
  };

  // If it's a mobile device, render the mobile error page
  if (isMobileDevice) {
    return <MobileErrorPage />;
  }

  return (
    <Router>
      <div className="app-app">
        <Navbar user={user} onLogout={onLogout} showNotification={showNotification} />
        <Routes>
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/" element={<HomePage user={user} showNotification={showNotification} />} />
          <Route path="/ChoosePage" element={<ChoosePage />} />
          <Route path="/download" element={<DownloadPage user={user} showNotification={showNotification} />} />
          <Route 
            path="/manual-check" 
            element={renderProtectedRoute(ManualCheck)}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {showToast && <Toast message={toastMessage} type={toastType} />}
        <Footer />
      </div>
    </Router>
  );
}

export default App;