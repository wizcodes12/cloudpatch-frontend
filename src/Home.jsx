import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function Home() {
  return (
    <div className="home-container">
      <div className="cloud-bg"></div>
      <div className="home-content">
        <h1>Ran into an error? Fix it with <span className="highlight">CloudPatch.Ai</span></h1>
        <Link to="/fix" className="button">Try Now</Link>
      </div>
    </div>
  );
}
export default Home;