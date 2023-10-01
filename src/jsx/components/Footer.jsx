
import React from 'react';
import { Container, Navbar } from 'react-bootstrap';

function Footer() {
  return (
    <Navbar className="border-top" style={{ backgroundColor: '#f8f9fa' }}>
      <Container className="text-center p-5 justify-content-center">
        <p className="mb-0">Holidaze &copy; {new Date().getFullYear()}</p>
      </Container>
    </Navbar>
  );
}

export default Footer;
