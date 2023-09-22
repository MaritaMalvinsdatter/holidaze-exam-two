import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav as BootstrapNav, Container } from 'react-bootstrap';
import styles from '../../styles/Nav.module.css';

function Nav() {
  return (
    <Navbar collapseOnSelect expand="lg" className={styles.navbar}>
      <Container>
        <Navbar.Brand>
          <Link to="/" className={styles.logoLink}>
            HOLIDAZE
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <BootstrapNav className="ms-auto">
              <BootstrapNav.Item>
                  <BootstrapNav.Link as={Link} to="/" className={styles.navLink}>Home</BootstrapNav.Link>
              </BootstrapNav.Item>
              <BootstrapNav.Item>
                  <BootstrapNav.Link as={Link} to="/login" className={styles.navLink}>Log In</BootstrapNav.Link>
              </BootstrapNav.Item>
              <BootstrapNav.Item>
                  <BootstrapNav.Link as={Link} to="/profile" className={styles.navLink}>Profile</BootstrapNav.Link>
              </BootstrapNav.Item>
          </BootstrapNav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Nav;
