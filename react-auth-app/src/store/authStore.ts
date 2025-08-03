import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        username,
        password,
      });
      
      const { token, user } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      // Update the state with the new user and token
      set({
        user,
        token,
        isAuthenticated: true,
      });
      
      return user; // Return the user data for the component to use
    } catch (error) {
      console.error('Login failed:', error);
      // Clear any existing auth state on failure
      localStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
      throw error; // Re-throw the error to be handled by the component
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
