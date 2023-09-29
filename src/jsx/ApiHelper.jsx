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

  const saveUserAndToken = (userData, token) => {
    storage.save('profile', userData);
    storage.save('token', token);
    setUser(userData); 
    setToken(token); 
  };

  const clearUserAndToken = () => {
    storage.remove('profile');
    storage.remove('token');
    setUser(null); 
    setToken(null); 
  };

  const logout = () => {
    clearUserAndToken();
    window.location.href = "/"; 
  };

  const refreshTokenState = () => {
    const storedToken = storage.load('token');
    setToken(storedToken);
  };

  return { user, token, saveUserAndToken, clearUserAndToken, logout, refreshTokenState };
}

export async function apiRequest(url, options = {}, token = null) {
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
    const text = await response.text();
      if (!text) {
        return null;  // or {} or whatever you prefer
      }
        return JSON.parse(text);
    } else {
      throw new Error('API request failed');
  }

}


export const getTotalPrice = (startDate, endDate, nightlyPrice) => {
  if (!startDate || !endDate || !nightlyPrice) return 0;

    const start = new Date(startDate);
    start.setHours(0,0,0,0); // reset time to midnight
    const end = new Date(endDate);
    end.setHours(0,0,0,0); // reset time to midnight

    const differenceInDays = (end - start) / (1000 * 3600 * 24);

    return Math.round(differenceInDays) * nightlyPrice;
};


