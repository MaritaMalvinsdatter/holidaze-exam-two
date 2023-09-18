

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiHelper } from '../ApiHelper'; 
import { API_BASE, API_LOGIN } from '../EndPoints';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { saveUserAndToken } = ApiHelper(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const authenticationUrl = API_BASE + API_LOGIN;
  
    try {
      const response = await fetch(authenticationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        const { name, email, avatar, venueManager, accessToken } = data;
  
        const userData = { name, email, avatar, venueManager }; // Grouping the user-related data
  
        saveUserAndToken(userData, accessToken); // Save the user data and access token
  
        console.log('User logged in:', userData);
      } else {
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account yet? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default LoginForm;