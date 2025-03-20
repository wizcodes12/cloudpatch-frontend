import React, { useState, useEffect } from "react";
import { FaGithub, FaCode, FaSearch, FaExclamationTriangle, FaCheck, FaSpinner } from "react-icons/fa";
import "../styles/Dashboard.css";

const Dashboard = ({ user, showNotification, API_BASE_URL }) => {
  const [activeTab, setActiveTab] = useState('manual');
  const [apiUrl, setApiUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [scanningRepo, setScanningRepo] = useState(false);
  const [apiIssues, setApiIssues] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userData = urlParams.get("userData");

    if (token) {
      // Store token in localStorage
      localStorage.setItem("github_token", token);
      
      // Store user data if available
      if (userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          localStorage.setItem("user_data", JSON.stringify(parsedUserData));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check for existing token
    const storedToken = localStorage.getItem("github_token");
    if (!storedToken) {
      showNotification("Please login with GitHub to continue", "warning");
      return;
    }

    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      const token = localStorage.getItem("github_token");
      if (!token) {
        showNotification("GitHub token is missing. Please login again.", "error");
        return;
      }

      const response = await fetch("http://localhost:8000/api/user/repos", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("github_token");
          showNotification("Session expired. Please login again.", "error");
          return;
        }
        throw new Error(`Error fetching repositories: ${response.statusText}`);
      }

      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      console.error("Failed to fetch repositories:", error);
      showNotification("Failed to fetch repositories. Please try logging in again.", "error");
    }
  };

  const fetchFiles = async (repoFullName) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("github_token");
      const response = await fetch(`${API_BASE_URL}/repo/${repoFullName}/contents`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching files: ${response.statusText}`);
      }
      
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      showNotification("Failed to fetch files", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchFileContent = async (repoFullName, path) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("github_token");
      const response = await fetch(
        `${API_BASE_URL}/repo/${repoFullName}/content?path=${encodeURIComponent(path)}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          credentials: 'include'
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error fetching file content: ${response.statusText}`);
      }
      
      const data = await response.json();
      setFileContent(data.content);
      scanFileForApiIssues(data.content);
    } catch (error) {
      showNotification("Failed to fetch file content", "error");
    } finally {
      setLoading(false);
    }
  };

  const checkApi = async (apiUrl) => {
    if (!apiUrl) {
      showNotification("Please enter a valid API URL", "error");
      return;
    }
  
    try {
      setLoading(true);
      const token = localStorage.getItem("github_token");
      const response = await fetch(
        `${API_BASE_URL}/check-api?api_url=${encodeURIComponent(apiUrl)}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          credentials: 'include'
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error checking API: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      showNotification("Failed to check API", "error");
    } finally {
      setLoading(false);
    }
  };

  const scanFileForApiIssues = async (content) => {
    const patterns = [
      /https?:\/\/[^\s'"]+/g,
      /fetch\(['"]([^'"]+)['"]\)/g,
      /axios\.(get|post|put|delete)\(['"]([^'"]+)['"]\)/g,
      /url:\s*['"]([^'"]+)['"]/g,
    ];

    const endpoints = new Set();
    patterns.forEach(pattern => {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        const url = match[1] || match[0];
        if (url.includes('api') || url.includes('http')) {
          endpoints.add(url.trim());
        }
      }
    });

    const issues = [];
    const token = localStorage.getItem("github_token");
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/check-api?api_url=${encodeURIComponent(endpoint)}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            credentials: 'include'
          }
        );
        
        if (!response.ok) {
          throw new Error(`Error checking endpoint: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (data.error) {
          issues.push({
            endpoint,
            ...data
          });
        }
      } catch (error) {
        console.error("Error checking endpoint:", endpoint, error);
      }
    }
    setApiIssues(issues);
  };

  const scanEntireRepo = async () => {
    if (!selectedRepo) return;
    
    setScanningRepo(true);
    const allIssues = [];
    
    try {
      for (const file of files) {
        if (file.name.endsWith('.js') || file.name.endsWith('.jsx') || 
            file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
          const content = await fetchFileContent(selectedRepo.full_name, file.path);
          const fileIssues = await scanFileForApiIssues(content);
          if (fileIssues && fileIssues.length > 0) {
            allIssues.push({
              file: file.path,
              issues: fileIssues
            });
          }
        }
      }
      setApiIssues(allIssues.flat());
      showNotification(`Scan complete. Found ${allIssues.length} issues.`, "info");
    } catch (error) {
      showNotification("Error scanning repository", "error");
    } finally {
      setScanningRepo(false);
    }
  };

  const handleAutoFix = async (issue) => {
    const token = localStorage.getItem("github_token");
    if (!token) {
      showNotification("Please login with GitHub first", "error");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/send-fix`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          api_url: issue.endpoint,
          fix_content: issue.solution,
          repo_name: selectedRepo?.full_name,
          file_path: selectedFile?.path,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error applying fix: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.message) {
        showNotification("Fix applied successfully");
        // Refresh file content
        if (selectedRepo && selectedFile) {
          await fetchFileContent(selectedRepo.full_name, selectedFile.path);
        }
      }
    } catch (error) {
      showNotification("Failed to apply fix", "error");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>CloudPatch.ai Dashboard</h1>
        <div className="tab-switcher">
          <button 
            className={`tab-button ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => setActiveTab('manual')}
          >
            Manual Check
          </button>
          <button 
            className={`tab-button ${activeTab === 'repos' ? 'active' : ''}`}
            onClick={() => setActiveTab('repos')}
          >
            Repository Scanner
          </button>
        </div>
      </div>

      {localStorage.getItem("github_token") ? (
        <div className="dashboard-content">
          {activeTab === 'manual' ? (
            <div className="manual-check-section">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Enter API URL to check"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="api-input"
                />
                <button
                  className="check-button"
                  onClick={() => checkApi(apiUrl)}
                  disabled={loading}
                >
                  {loading ? <FaSpinner className="spinner" /> : <FaSearch />}
                  {loading ? "Checking..." : "Check API"}
                </button>
              </div>

              {result && (
                <div className="results-container">
                  <div className="info-card">
                    <h2>API Information</h2>
                    <div className="info-content">
                      <div className="info-item">
                        <h3>Hosting Platform</h3>
                        <p>{result.platform}</p>
                      </div>
                      {result.error && (
                        <div className="info-item error">
                          <h3>Error Details</h3>
                          <p>{result.error}</p>
                        </div>
                      )}
                      {result.solution && (
                        <div className="solution-card">
                          <h3>Suggested Fix</h3>
                          <pre><code>{result.solution}</code></pre>
                          <button 
                            className="fix-button"
                            onClick={() => handleAutoFix(result)}
                          >
                            Apply Fix
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="repo-scanner-section">
              <div className="repo-list">
                <div className="repo-search">
                  <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="repositories">
                  {repositories
                    .filter(repo => repo.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(repo => (
                      <div 
                        key={repo.id}
                        className={`repo-item ${selectedRepo?.id === repo.id ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedRepo(repo);
                          fetchFiles(repo.full_name);
                        }}
                      >
                        <FaCode className="repo-icon" />
                        <div className="repo-info">
                          <h3>{repo.name}</h3>
                          <p>{repo.description}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {selectedRepo && (
                <div className="file-explorer">
                  <div className="file-explorer-header">
                    <h2>{selectedRepo.name}</h2>
                    <button 
                      className="scan-button"
                      onClick={scanEntireRepo}
                      disabled={scanningRepo}
                    >
                      {scanningRepo ? <FaSpinner className="spinner" /> : "Scan Repository"}
                    </button>
                  </div>
                  <div className="file-list">
                    {files.map(file => (
                      <div
                        key={file.sha}
                        className={`file-item ${selectedFile?.sha === file.sha ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedFile(file);
                          fetchFileContent(selectedRepo.full_name, file.path);
                        }}
                      >
                        {file.name}
                      </div>
                    ))}
                  </div>
                  {selectedFile && (
                    <div className="file-content">
                      <h3>{selectedFile.path}</h3>
                      <pre><code>{fileContent}</code></pre>
                    </div>
                  )}
                </div>
              )}

              {apiIssues.length > 0 && (
                <div className="issues-panel">
                  <h2>API Issues Found</h2>
                  {apiIssues.map((issue, index) => (
                    <div key={index} className="issue-item">
                      <div className="issue-header">
                        <FaExclamationTriangle className="issue-icon" />
                        <h3>Issue in {issue.endpoint}</h3>
                      </div>
                      <p className="issue-error">{issue.error}</p>
                      {issue.solution && (
                        <>
                          <pre><code>{issue.solution}</code></pre>
                          <button 
                            className="fix-button"
                            onClick={() => handleAutoFix(issue)}
                          >
                            Apply Fix
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="login-message">
          <p>Please login with GitHub to use the dashboard.</p>
          <a href="http://localhost:5000/auth/github" className="github-login-btn">
            <FaGithub />
            <span>Sign in with GitHub</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default Dashboard;