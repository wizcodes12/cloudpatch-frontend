import React, { useState, useEffect } from 'react';
import { FaCode, FaSearch, FaSpinner, FaExclamationTriangle, FaFolder } from 'react-icons/fa';
import '../styles/GithubCheck.css';

const FileViewer = ({ file }) => {
  if (!file?.content?.[0]) return null;

  const { content, content_type } = file.content[0];

  const renderContent = () => {
    if (!content) return <div>No content available</div>;

    // Handle different content types
    if (content_type?.startsWith('text/') || 
        content_type === 'application/json' || 
        content_type === 'application/javascript' || 
        content_type === 'application/xml') {
      return (
        <pre className="file-content">
          <code>{content}</code>
        </pre>
      );
    } else if (content_type?.startsWith('image/')) {
      return <img src={`data:${content_type};base64,${content}`} alt="File content" />;
    } else {
      return <div>Binary file: {content_type}</div>;
    }
  };

  return (
    <div className="file-viewer">
      <h3>File Content ({content_type})</h3>
      {renderContent()}
    </div>
  );
};

const GithubCheck = ({ showNotification, API_BASE_URL }) => {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      const token = localStorage.getItem("github_token");
      if (!token) {
        showNotification("GitHub token is missing. Please login again.", "error");
        return;
      }

      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/user/repos`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Error fetching repositories: ${response.statusText}`);
      }

      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      console.error("Repository fetch error:", error);
      showNotification("Failed to fetch repositories", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchRepoContents = async (repo, path = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("github_token");
      
      const [owner, repoName] = repo.full_name.split('/');
      
      console.log(`Fetching contents for ${owner}/${repoName}/${path}`);

      const response = await fetch(`${API_BASE_URL}/api/repos/${owner}/${repoName}/contents/${path}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Error fetching contents: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Received files:", data);
      setFiles(data);
      setCurrentPath(path);
      setSelectedFile(null);
    } catch (error) {
      console.error("Content fetch error:", error);
      showNotification("Failed to fetch repository contents", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file) => {
    try {
      if (file.type === "dir") {
        // Handle directory navigation
        await fetchRepoContents(selectedRepo, file.path);
        return;
      }

      setSelectedFile(file);
      
      if (file.type === "file" && selectedRepo) {
        setLoading(true);
        const token = localStorage.getItem("github_token");
        const [owner, repo] = selectedRepo.full_name.split('/');
        
        console.log(`Scanning file: ${owner}/${repo}/${file.path}`);

        const response = await fetch(`${API_BASE_URL}/api/scan-file`, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({
            owner,
            repo,
            path: file.path
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error scanning file: ${response.statusText}\n${errorText}`);
        }

        const data = await response.json();
        console.log("File data:", data);

        const updatedFile = {
          ...file,
          content: [{
            ...file.content?.[0],
            content: data.content,
            content_type: data.content_type,
            scan_results: data.scan_results
          }]
        };
        
        setSelectedFile(updatedFile);
        
        if (data.scan_results?.apis_found?.length > 0) {
          showNotification(`Found ${data.scan_results.apis_found.length} APIs in file`, "info");
        }
      }
    } catch (error) {
      console.error("File scan error:", error);
      showNotification(`Failed to scan file: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFix = async (apiUrl, fixContent) => {
    try {
      const token = localStorage.getItem("github_token");
      if (!token || !selectedRepo || !selectedFile) {
        showNotification("Missing required information for fix", "error");
        return;
      }

      const [owner, repo] = selectedRepo.full_name.split('/');
      
      const response = await fetch(`${API_BASE_URL}/api/apply-fix`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          owner,
          repo,
          path: selectedFile.path,
          api_url: apiUrl,
          fix_content: fixContent
        })
      });

      if (!response.ok) {
        throw new Error(`Error applying fix: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Fix result:", result);
      showNotification("Fix applied successfully", "success");
      
      // Refresh current directory contents
      await fetchRepoContents(selectedRepo, currentPath);
    } catch (error) {
      console.error("Fix application error:", error);
      showNotification("Failed to apply fix", "error");
    }
  };

  const handleNavigateUp = async () => {
    if (!currentPath || !selectedRepo) return;
    
    const newPath = currentPath.split('/').slice(0, -1).join('/');
    await fetchRepoContents(selectedRepo, newPath);
  };

  return (
    <div className="github-check">
      <div className="scanner-content">
        <div className="repo-list">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="repositories">
            {loading && !files.length ? (
              <div className="loading">
                <FaSpinner className="spinner" />
                <p>Loading repositories...</p>
              </div>
            ) : (
              repositories
                .filter(repo => repo.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(repo => (
                  <div 
                    key={repo.id}
                    className={`repo-item ${selectedRepo?.id === repo.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRepo(repo);
                      fetchRepoContents(repo);
                    }}
                  >
                    <FaCode className="repo-icon" />
                    <div className="repo-info">
                      <h3>{repo.name}</h3>
                      <p>{repo.description || 'No description available'}</p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {selectedRepo && (
          <div className="repo-content">
            <div className="files-section">
              <h2>Repository Files</h2>
              {currentPath && (
                <div className="path-navigation">
                  <button onClick={handleNavigateUp}>↑ Up</button>
                  <span className="current-path">{currentPath || '/'}</span>
                </div>
              )}
              <div className="file-list">
                {loading ? (
                  <div className="loading">
                    <FaSpinner className="spinner" />
                    <p>Loading files...</p>
                  </div>
                ) : (
                  files.map(file => (
                    <div
                      key={file.sha}
                      className={`file-item ${selectedFile?.sha === file.sha ? 'selected' : ''}`}
                      onClick={() => handleFileSelect(file)}
                    >
                      {file.type === 'dir' ? <FaFolder className="file-icon" /> : <FaCode className="file-icon" />}
                      {file.name}
                      {file.content && file.content[0]?.apis_found?.length > 0 && (
                        <span className="api-badge">
                          {file.content[0].apis_found.length} APIs
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {selectedFile && (
              <div className="file-content-section">
                <FileViewer file={selectedFile} />
                
                {selectedFile.content && selectedFile.content[0]?.apis_found?.length > 0 && (
                  <div className="issues-panel">
                    <h2>APIs Found</h2>
                    {selectedFile.content[0].apis_found.map((api, index) => (
                      <div key={index} className="issue-card">
                        <div className="issue-header">
                          <FaExclamationTriangle className="issue-icon" />
                          <h3>API Endpoint: {api}</h3>
                        </div>
                        {selectedFile.content[0].scan_results?.solutions?.[index] && (
                          <div className="solution-section">
                            <h4>Suggested Fix:</h4>
                            <pre><code>{selectedFile.content[0].scan_results.solutions[index]}</code></pre>
                            <button 
                              className="fix-button"
                              onClick={() => handleAutoFix(api, selectedFile.content[0].scan_results.solutions[index])}
                            >
                              Apply Fix
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GithubCheck;