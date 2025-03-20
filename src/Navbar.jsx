import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1>CloudPatch.Ai</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/download">Download</Link>
        <Link to="/docs">Documentation</Link>
        <Link to="/help">Help</Link>
      </div>
    </nav>
  );
}
export default Navbar;