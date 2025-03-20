import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

function ErrorFixer() {
  const [apiUrl, setApiUrl] = useState("");
  const [error, setError] = useState("");
  const [solution, setSolution] = useState("");
  const [githubAuth, setGithubAuth] = useState(false);

  const handleCheckAPI = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/check-api?api_url=${encodeURIComponent(apiUrl)}`);
      setError(res.data.error || "No errors detected");
      setSolution(res.data.solution || "No solution needed");
    } catch (err) {
      setError("Failed to fetch data");
    }
  };
  

  const handleGitHubLogin = async () => {
    const res = await axios.get("http://localhost:8000/login/github");
    window.location.href = res.data.url;
  };

  const handleAutoFix = async () => {
    try {
      const res = await axios.post("http://localhost:8000/send-fix", {
        repo_name: "user-repo",
        file_path: "error_file.js",
        fix_content: solution,
      });
      alert("Fix applied successfully!");
    } catch (err) {
      alert("Failed to apply fix");
    }
  };

  return (
    <div className="error-fixer-container">
      <input type="text" placeholder="Enter API URL" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
      <button onClick={handleCheckAPI}>Check API</button>
      {error && <div className="error-message">Error: {error}</div>}
      {solution && <div className="solution-message">Solution: {solution}</div>}
      {!githubAuth && <button onClick={handleGitHubLogin}>Login with GitHub</button>}
      {githubAuth && <button onClick={handleAutoFix}>Auto Fix</button>}
    </div>
  );
}
export default ErrorFixer;