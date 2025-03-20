import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaWindows, 
  FaDownload, 
  FaShieldAlt,
  FaBolt
} from 'react-icons/fa';
import { saveAs } from 'file-saver';

import "../styles/DownloadPage.css";

const DownloadPage = ({ showNotification }) => {
  // This is a pre-encoded small icon in base64 format
  // This is a basic cloud icon that will work as a placeholder
  const ICON_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGcSURBVDiNpZMxSxxBGIafb3ZuL6dEFK0iWojY2EWiYhVQUaJEKxHBQmz8A1aClVikCFZpgljoL9DCiKWVlY1YxCQQkbsIE3ZunLl9v9sZ7uKO3Xs1XsNQzDvP+8AUAJk2My6wPbZ6eZnCbrX9Fbi3XTcBWO7UXZ4WLbTFnzkVFJpiBdIrQ+Np/oGOWQDNFUPCEojxuW8pxp3+2BZMrNQ+TqUxdM2H8pJYrUG7BbUGHWkpZSxnlHQSUW4PjNAJoTQIKpDAqpJKwS4hs6NrYJNAcWGH3etv+8CmLuNfgNxO4MMaZPNiJg5QOlcKiCQ1WFE0vgDzWOJR13+tZb6sPDzBEf5+1dD7AkxvH+XLzfLB8/vx+qQN/RX+NRTyGjNHbRjUb5FnHsaIVGBRWACiQ1PEgOSIeIhxJy0Xpx/ACVBM4XqR4IQIW3K9iPBVPj8QSXwdZgIm5iPHNiUTSNFQ2nG9ZYVGKTVjrwHzITMJTiStv9tgCz0sJ3FPRW8KKwZo5yvmQvIAJo1YB8rRoXhpVctLOCRuBLkxRIBvQHd0BNQk1WsAAAAASUVORK5CYII=";

  // Function to create and download the HTML shortcut file
  const downloadShortcut = () => {
    // Create HTML shortcut content with redirect and fixed icon
    const shortcutContent = `
<!DOCTYPE html>
<html>
<head>
<title>CloudPatch AI</title>
<link rel="icon" href="${ICON_BASE64}" type="image/png">
<meta http-equiv="refresh" content="0; url=http://localhost:3000/ChoosePage">
<script type="text/javascript">
  window.location.href = "http://localhost:3000/ChoosePage";
</script>
<style>
  body {
    font-family: Arial, sans-serif;
    text-align: center;
    margin-top: 50px;
    background-color: #f5f5f5;
  }
  .logo {
    width: 100px;
    height: 100px;
    margin: 0 auto 20px;
    background-image: url('${ICON_BASE64}');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  h1 {
    color: #0078D7;
    font-size: 24px;
  }
  p {
    color: #666;
  }
  a {
    color: #0078D7;
    text-decoration: none;
  }
</style>
</head>
<body>
  <div class="logo"></div>
  <h1>CloudPatch AI</h1>
  <p>If you are not redirected automatically, <a href="http://localhost:3000/ChoosePage">click here</a>.</p>
</body>
</html>
    `;

    // Create a blob with the HTML content
    const blob = new Blob([shortcutContent], { type: 'text/html' });
    
    // Use FileSaver to prompt the user for save location
    saveAs(blob, 'CloudPatch AI.htm');
    
    showNotification("Desktop shortcut created! Save it to your desktop for quick access.", "success");
  };

  const downloadFeatures = [
    { icon: <FaBolt />, text: "Quick Access" },
    { icon: <FaShieldAlt />, text: "Secure Connection" }
  ];

  return (
    <div className="download-page-enhanced-dp">
      <div className="download-background-dp">
        <div className="bg-pattern"></div>
      </div>
      
      <motion.div 
        className="download-container-dp"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="download-header-dp">
          <motion.div
            className="logo-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <div className="header-text">
              <h1></h1>
              <div className="header-tagline"></div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="main-content-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className="download-card-dp"
            key="download-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            <div className="card-inner">
              <div className="windows-logo-large-dp">
                <FaWindows />
              </div>
              <h2>Create Desktop Shortcut</h2>
              
              <div className="download-features">
                {downloadFeatures.map((feature, index) => (
                  <div key={index} className="feature-item">
                    {feature.icon}
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
              
              <motion.button 
                className="download-cta-dp"
                onClick={downloadShortcut}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaDownload /> Download Shortcut
              </motion.button>
              
              <div className="shortcut-info">
                <p>Creates a shortcut to desktop for one-click access</p>
                {/* <p>Save to your desktop for one-click access</p> */}
              </div>
              
              <div className="coming-soon-info">
                <p>Desktop app coming soon!</p>
              </div>
            </div>
            
            <div className="card-glow"></div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DownloadPage;