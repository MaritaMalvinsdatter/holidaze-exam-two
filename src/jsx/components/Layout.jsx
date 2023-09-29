// Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './Nav.jsx';
import Footer from './Footer.jsx';
import { useApiHelper } from '../ApiHelper.jsx';

function Layout() {
  const { token } = useApiHelper();

  return (
    <div>
      <Nav key={token || 'logged-out'} />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
