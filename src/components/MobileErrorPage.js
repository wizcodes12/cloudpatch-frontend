import React from "react";
import "../styles/MobileErrorPage.css";

const MobileErrorPage = () => {
  return (
    <div className="mobile-error-container">
      <div className="mobile-error-content">
        <img 
          src="Main_logo.png" 
          alt="CloudPatch AI Logo" 
          className="mobile-error-logo" 
        />
        <h1 className="mobile-error-title">Oops!</h1>
        <p className="mobile-error-message">
          CloudPatch AI is not available on mobile devices.
        </p>
        <p className="mobile-error-instruction">
          Please open on a PC or larger screen to continue.
        </p>
      </div>
    </div>
  );
};

export default MobileErrorPage;