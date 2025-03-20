import React, { useState } from "react";
import { motion } from "framer-motion";
import '../styles/HelpPage.css';

const HelpPage = () => {
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const categories = [
    { id: "getting-started", label: "Getting Started" },
    { id: "features", label: "Features & Capabilities" },
    { id: "troubleshooting", label: "Troubleshooting" },
    { id: "scan-options", label: "Scan Options" },
    { id: "security", label: "Security" }
  ];

  const helpContent = {
    "getting-started": {
      title: "Getting Started with API Fixer",
      description: "Learn how to use our powerful tool to scan, analyze, and fix your API endpoints.",
      steps: [
        {
          title: "1. Connect GitHub",
          content: "Sign in with GitHub to enable advanced scanning and auto-fix capabilities."
        },
        {
          title: "2. Choose Hosting Type",
          content: "Select between local and cloud-hosted APIs for comprehensive scanning."
        },
        {
          title: "3. Enter API Details",
          content: "Provide your API endpoint URL or local server details for analysis."
        },
        {
          title: "4. Scan and Resolve",
          content: "Run a scan to detect issues and use our intelligent tools to fix problems."
        }
      ]
    },
    "features": {
      title: "Features & Capabilities",
      description: "Explore the powerful features of our API scanning and fixing tool.",
      features: [
        {
          title: "Comprehensive API Scanning",
          description: "Detect issues in both local and cloud-hosted APIs with detailed analysis."
        },
        {
          title: "GitHub Integration",
          description: "Seamlessly connect and fix issues directly in your GitHub repositories."
        },
        {
          title: "Intelligent Error Detection",
          description: "Advanced AI-powered scanning to identify complex API problems and vulnerabilities."
        },
        {
          title: "Automated Fix Suggestions",
          description: "Get intelligent, context-aware solutions for detected API issues."
        },
        {
          title: "PDF Reporting",
          description: "Generate comprehensive PDF reports for detailed issue documentation."
        },
        {
          title: "Multi-Protocol Support",
          description: "Support for HTTP/HTTPS and various request methods (GET, POST, PUT, DELETE)."
        }
      ]
    },
    "troubleshooting": {
      title: "Troubleshooting",
      description: "Common issues and solutions when using API Fixer.",
      faqs: [
        {
          question: "Why can't I connect my local server?",
          answer: "Ensure your local server is running on the specified port. Check firewall settings, verify server startup command, and confirm no other process is using the port."
        },
        {
          question: "What if the auto-fix doesn't work?",
          answer: "If an auto-fix fails, carefully review the suggested solution. You can manually apply the fix or create a GitHub issue with the detailed report."
        },
        {
          question: "How accurate are the error detections?",
          answer: "Our AI-powered scanner uses advanced algorithms to detect potential issues. However, always review suggestions carefully and test in your specific environment."
        },
        {
          question: "Can I scan APIs from different hosting platforms?",
          answer: "Yes! Our tool supports both local development servers and cloud-hosted APIs. Simply select the appropriate hosting type and enter the endpoint details."
        }
      ]
    },
    "scan-options": {
      title: "Scan Configuration",
      description: "Detailed guide to configuring your API scans.",
      sections: [
        {
          title: "Hosting Type Selection",
          content: "Choose between 'Local' for development servers and 'Cloud' for hosted APIs. This determines how the scanner connects to your endpoint."
        },
        {
          title: "Local Server Scanning",
          content: "For local scans, specify:\n- Protocol (HTTP/HTTPS)\n- Port number\n- Request method (GET, POST, PUT, DELETE)\n- Specific endpoint path"
        },
        {
          title: "Cloud API Scanning",
          content: "For cloud APIs, simply enter the full URL of the endpoint you want to scan. Supports various authentication and request types."
        },
        {
          title: "Scan Depth",
          content: "Our AI performs comprehensive checks including:\n- Syntax errors\n- Performance bottlenecks\n- Security vulnerabilities\n- Potential runtime issues"
        }
      ]
    },
    "security": {
      title: "Security & Privacy",
      description: "Our commitment to protecting your code and data.",
      sections: [
        {
          title: "Data Protection",
          content: "All scans are performed in secure, isolated environments. Your code and API details are never stored permanently."
        },
        {
          title: "GitHub Authorization",
          content: "We use GitHub OAuth with minimal, read-only permissions. You can revoke access at any time through your GitHub account settings."
        },
        {
          title: "Confidential Reporting",
          content: "Generated reports and fix suggestions are processed confidentially. PDF reports can be downloaded securely."
        },
        {
          title: "Transparent Processes",
          content: "All automated fixes and suggestions are generated transparently, with full visibility into the modification process."
        }
      ]
    }
  };

  return (
    <div className="help-page">
      <div className="help-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="help-title"
        >
          CloudPatch.AI Help Center
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="help-subtitle"
        >
          Comprehensive guidance for scanning, analyzing, and fixing your APIs
        </motion.p>
      </div>

      <div className="help-content-wrapper">
        <motion.div 
          className="help-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search help topics..." 
              className="search-input"
            />
          </div>
          <nav className="category-nav">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </nav>
          <div className="contact-support">
            <h3>Need more help?</h3>
            <button className="support-button">Contact Support</button>
          </div>
        </motion.div>

        <motion.div 
          className="help-main-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Render different sections based on active category */}
          {activeCategory === "getting-started" && (
            <div className="content-section">
              <h2>{helpContent["getting-started"].title}</h2>
              <p className="section-description">{helpContent["getting-started"].description}</p>
              
              <div className="steps-container">
                {helpContent["getting-started"].steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="step-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <h3>{step.title}</h3>
                    <p>{step.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === "features" && (
            <div className="content-section">
              <h2>{helpContent["features"].title}</h2>
              <p className="section-description">{helpContent["features"].description}</p>
              
              <div className="features-grid">
                {helpContent["features"].features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="feature-help-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === "troubleshooting" && (
            <div className="content-section">
              <h2>{helpContent["troubleshooting"].title}</h2>
              <p className="section-description">{helpContent["troubleshooting"].description}</p>
              
              <div className="faq-container">
                {helpContent["troubleshooting"].faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className={`faq-item ${expandedFAQ === index ? 'expanded' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <div 
                      className="faq-question"
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    >
                      <h3>{faq.question}</h3>
                      <span className="expand-icon">{expandedFAQ === index ? '−' : '+'}</span>
                    </div>
                    {expandedFAQ === index && (
                      <motion.div
                        className="faq-answer"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <p>{faq.answer}</p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === "scan-options" && (
            <div className="content-section">
              <h2>{helpContent["scan-options"].title}</h2>
              <p className="section-description">{helpContent["scan-options"].description}</p>
              
              <div className="scan-options-sections">
                {helpContent["scan-options"].sections.map((section, index) => (
                  <motion.div
                    key={index}
                    className="scan-option-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <h3>{section.title}</h3>
                    <p>{section.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeCategory === "security" && (
            <div className="content-section">
              <h2>{helpContent["security"].title}</h2>
              <p className="section-description">{helpContent["security"].description}</p>
              
              <div className="security-sections">
                {helpContent["security"].sections.map((section, index) => (
                  <motion.div
                    key={index}
                    className="security-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <h3>{section.title}</h3>
                    <p>{section.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HelpPage;