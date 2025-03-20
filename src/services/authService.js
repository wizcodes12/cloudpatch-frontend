class AuthService {
  constructor() {
    this.tokenKey = 'github_auth_state';
    this.githubTokenKey = 'github_token';
    this.refreshTimer = null;
    this.AUTH_BASE_URL = "https://cloudpatch-backend-js.onrender.com";
  }


  // Store auth state with token and user info
  setAuthState(token, user) {
    if (!token) {
      console.error('Attempted to store empty token');
      return;
    }

    const authState = {
      token,
      user,
      expiresAt: new Date().getTime() + 23 * 60 * 60 * 1000 // 23 hours
    };
   
    try {
      // Store in both localStorage and sessionStorage for persistence
      localStorage.setItem(this.tokenKey, JSON.stringify(authState));
      sessionStorage.setItem(this.tokenKey, JSON.stringify(authState));
      
      // Also store the token specifically for GitHub
      this.storeGitHubToken(token, user);
      
      // Set up refresh timer
      this.setupRefreshTimer();
      
      console.log('Auth state stored successfully');
    } catch (error) {
      console.error('Error storing auth state:', error);
    }
  }

  getAuthState() {
    // Try sessionStorage first, then localStorage
    const state = sessionStorage.getItem(this.tokenKey) || localStorage.getItem(this.tokenKey);
    if (!state) return null;
   
    try {
      const authState = JSON.parse(state);
      // Check if token is expired
      if (new Date().getTime() > authState.expiresAt) {
        this.clearAuthState();
        return null;
      }
      return authState;
    } catch (e) {
      console.error('Error parsing auth state:', e);
      this.clearAuthState();
      return null;
    }
  }

  getToken() {
    const authState = this.getAuthState();
    if (authState && authState.token) {
      return authState.token;
    }
    
    // Fallback: Try to get directly from GitHub token storage
    return this.getGitHubToken();
  }

  getUser() {
    const authState = this.getAuthState();
    return authState ? authState.user : null;
  }

  clearAuthState() {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
    // Also clear GitHub specific tokens
    localStorage.removeItem(this.githubTokenKey);
    localStorage.removeItem('user_data');
    // Clear GitHub cookie
    document.cookie = `${this.githubTokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    
    console.log('Auth state cleared');
  }

  setupRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    // Refresh token 1 hour before expiration
    this.refreshTimer = setTimeout(async () => {
      try {
        const token = this.getToken();
        if (!token) {
          console.warn('No token found for refresh');
          return;
        }
        
        const response = await fetch(`${this.AUTH_BASE_URL}/api/validate-token`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          console.warn('Token validation failed during refresh');
          this.clearAuthState();
          return;
        }
        
        // If we get here, token is still valid, so extend expiration
        const authState = this.getAuthState();
        if (authState) {
          authState.expiresAt = new Date().getTime() + 23 * 60 * 60 * 1000;
          localStorage.setItem(this.tokenKey, JSON.stringify(authState));
          sessionStorage.setItem(this.tokenKey, JSON.stringify(authState));
          console.log('Token expiration extended');
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }, 22 * 60 * 60 * 1000); // Check after 22 hours
  }

  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }

  // Method to validate token with server
  async validateToken() {
    try {
      const token = this.getToken();
      if (!token) return false;
      
      const response = await fetch(`${this.AUTH_BASE_URL}/api/validate-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        this.clearAuthState();
        return false;
      }
      
      const data = await response.json();
      return data.valid === true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  /**
   * Gets the GitHub token from all possible storage locations
   * @returns {string|null} GitHub token or null if not found
   */
  getGitHubToken() {
    // Try multiple sources in sequence to find the token
    
    // 1. Try the main auth state first (most reliable)
    try {
      const authState = this.getAuthState();
      if (authState && authState.token) {
        console.log("Found token in auth state");
        return authState.token;
      }
    } catch (e) {
      console.warn('Failed to get token from auth state');
    }
    
    // 2. Try GitHub specific localStorage
    const tokenFromStorage = localStorage.getItem(this.githubTokenKey);
    if (tokenFromStorage) {
      console.log("Found token in localStorage");
      return tokenFromStorage;
    }
    
    // 3. Try user data object
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed && parsed.token) {
          console.log("Found token in user_data");
          return parsed.token;
        }
      }
    } catch (e) {
      console.warn('Failed to parse user data from localStorage');
    }
    
    // 4. Try sessionStorage
    const sessionToken = sessionStorage.getItem(this.githubTokenKey);
    if (sessionToken) {
      console.log("Found token in sessionStorage");
      return sessionToken;
    }
    
    // 5. Check URL parameters (for just after login redirect)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenParam = urlParams.get('token');
      if (tokenParam) {
        console.log("Found token in URL parameters");
        // Save it for future use
        this.storeGitHubToken(tokenParam);
        return tokenParam;
      }
    } catch (e) {
      console.warn('Failed to get token from URL parameters');
    }
    
    // 6. Check cookies as last resort
    try {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(this.githubTokenKey + '=')) {
          console.log("Found token in cookies");
          return cookie.substring(this.githubTokenKey.length + 1);
        }
      }
    } catch (e) {
      console.warn('Failed to get token from cookies');
    }
    
    console.warn('GitHub token not found in any storage location');
    return null;
  }

  /**
   * Stores the GitHub token in multiple storage locations for redundancy
   * @param {string} token The GitHub token to store
   * @param {object} userData Optional user data to store alongside token
   */
  storeGitHubToken(token, userData = null) {
    if (!token) {
      console.error('Attempted to store empty GitHub token');
      return;
    }
    
    try {
      // Store in multiple locations for redundancy
      localStorage.setItem(this.githubTokenKey, token);
      sessionStorage.setItem(this.githubTokenKey, token);
      
      // Store in a cookie with appropriate attributes
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7); // 7 day expiry
      document.cookie = `${this.githubTokenKey}=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
      
      // If userData provided, store that too
      if (userData) {
        localStorage.setItem('user_data', JSON.stringify({
          ...userData,
          token: token
        }));
      }
      
      console.log('GitHub token stored successfully in multiple locations');
    } catch (error) {
      console.error('Error storing GitHub token:', error);
    }
  }
  
  /**
   * Initialize auth state from URL parameters (for redirects from OAuth)
   * @returns {boolean} True if initialized from URL, false otherwise
   */
  initFromUrlParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const userDataParam = params.get('userData');
      
      if (token) {
        let userData = null;
        if (userDataParam) {
          try {
            userData = JSON.parse(userDataParam);
          } catch (e) {
            console.warn('Failed to parse user data from URL');
          }
        }
        
        this.setAuthState(token, userData);
        
        // Clean up URL parameters
        const url = new URL(window.location.href);
        url.searchParams.delete('token');
        url.searchParams.delete('userData');
        window.history.replaceState({}, document.title, url.toString());
        
        return true;
      }
    } catch (error) {
      console.error('Error initializing from URL params:', error);
    }
    
    return false;
  }

  // Add this for debugging in authService.js
  clearAuthState() {
    console.log('Clearing auth state...');
    
    // Clear from all possible storage locations
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.githubTokenKey);
    sessionStorage.removeItem(this.githubTokenKey);
    localStorage.removeItem('user_data');
    
    // Clear all cookies related to authentication
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      const cookieName = cookie.split('=')[0];
      if (cookieName === this.githubTokenKey || cookieName.includes('github') || cookieName.includes('auth')) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    }
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    
    console.log('Auth state cleared');
  }
  
/**
 * Force a login redirect to GitHub
 * @param {string} returnUrl URL to return to after login
 * @param {string} clientType 'web' or 'electron'
 */
redirectToLogin(returnUrl = window.location.pathname, clientType = 'web') {
  const encodedReturnUrl = encodeURIComponent(returnUrl);
  // Explicitly set to localhost for development
  const redirectUri = 'http://localhost:3000';
  window.location.href = `${this.AUTH_BASE_URL}/auth/github?returnTo=${encodedReturnUrl}&client=${clientType}&redirectUri=${encodeURIComponent(redirectUri)}`;
}

}

export default new AuthService();