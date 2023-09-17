// ApiHelper.jsx

import { useState, useEffect } from 'react';
import * as storage from "./Storage";

export function useApiHelper() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = storage.load('profile');
    const storedToken = storage.load('token');
 
    if (storedUser) {
       setUser(storedUser);
    }
 
    if (storedToken) {
       setToken(storedToken);
    }
 }, [setUser, setToken]); 

  const apiRequest = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('API request failed');
    }
  };

  const saveUserAndToken = (userData, authToken) => {
    storage.save('profile', userData);
    storage.save('token', authToken);
    setUser(userData); 
    setToken(authToken); 
  };

  const clearUserAndToken = () => {
    storage.remove('profile');
    storage.remove('token');
    setUser(null); 
    setToken(null); 
  };

  return { user, token, apiRequest, saveUserAndToken, clearUserAndToken };
}

const logout = () => {
  // Clear user and token from local storage
  localStorage.removeItem("token");
  localStorage.removeItem("profile");

  // Redirect user to homepage or login page
  window.location.href = "/"; // redirect to homepage
};

export default logout
