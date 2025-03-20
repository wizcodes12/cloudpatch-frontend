// NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-message">Page Not Found</h2>
      <p className="not-found-description">
        Oops! The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>
      <Link to="/" className="not-found-button">
        Return to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;