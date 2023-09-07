// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../src/jsx/components/Layout.jsx';
import Home from '../src/jsx/pages/Home.jsx';
import RegisterForm from '../src/jsx/pages/Register.jsx'; // Import your RegisterForm component

function App() {
  return (
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<RegisterForm />} /> {/* Register route */}
        </Route>
      </Routes>
    </React.StrictMode>
  );
}

export default App;
