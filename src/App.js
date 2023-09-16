import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../src/jsx/components/Layout.jsx';
import Home from '../src/jsx/pages/Home.jsx';
import LoginForm from '../src/jsx/pages/Login.jsx';
import RegisterForm from '../src/jsx/pages/Register.jsx';
import ProfilePage from '../src/jsx/pages/Profile.jsx';
import VenueDetails from '../src/jsx/pages/VenueDetails.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<LoginForm />} /> 
          <Route path="profile" element={<ProfilePage />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="venue/:id" element={<VenueDetails />} />
        </Route>
      </Routes>
    </React.StrictMode>
  );
}

export default App;
