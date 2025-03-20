export const TokenManager = {
    // Store tokens in both localStorage and cookies for persistence
    setToken: (token) => {
      localStorage.setItem('github_token', token);
      document.cookie = `github_token=${token}; path=/; max-age=86400; samesite=lax`;
    },
  
    // Get token with fallback mechanisms
    getToken: () => {
      let token = localStorage.getItem('github_token');
      
      // Fallback to cookies if localStorage is empty
      if (!token) {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(c => c.trim().startsWith('github_token='));
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
          // Restore to localStorage if found in cookie
          localStorage.setItem('github_token', token);
        }
      }
      
      return token;
    },
  
    // Clear token from all storage mechanisms
    clearToken: () => {
      localStorage.removeItem('github_token');
      document.cookie = 'github_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  };
  