export interface User {
    _id: string;
    githubId: string;
    username: string;
    avatar?: string;
    email?: string;
  }
  
  export interface ApiCheckResponse {
    platform: string;
    repo_name?: string;
    file_path?: string;
    error?: string;
    solution?: string;
    status?: string;
  }