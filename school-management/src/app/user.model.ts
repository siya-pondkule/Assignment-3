// user.model.ts
export interface User {
    id: string; // assuming user has an id
    name: string;
    email: string;
    password: string;
    role: 'student' | 'teacher' | 'admin'; // Define roles clearly
    // Add any other properties relevant to the user
  }
  
  export interface ApiResponse {
    users: User[];
    // Add any other fields that might be returned by the API
  }
  