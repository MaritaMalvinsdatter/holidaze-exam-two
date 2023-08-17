import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../src/jsx/components/Layout.jsx';
import Home from '../src/jsx/pages/Home.jsx';
// import Venues from './components/Venues.jsx';
// import VenueDetails from './pages/VenueDetails.jsx';

function App() {
  return (
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* <Route path="Venues" element={<Venues />} />
          <Route path="Venue/:id" element={<VenueDetails />} /> */}
        </Route>
      </Routes>
    </React.StrictMode>
  );
}

export default App;
