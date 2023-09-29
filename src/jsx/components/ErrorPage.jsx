
import React from 'react';
import styles from '../../styles/ErrorPage.module.css';  
import { Link } from 'react-router-dom';  

function ErrorPage() {
    return (
      <div className={styles.errorPage}>
        <img 
          src='https://images.unsplash.com/photo-1453932128466-7d60a03d9adb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2103&q=80' 
          alt='background' 
          className={styles.backgroundImage}
        />
        <div className={styles.content}>
          <h1>404: Page Not Found</h1>
          <p>Oh no, looks like there's some funny monkey business going on! The page you were looking for doesn’t exist.</p>
          <Link to="/" className="btn btn-primary">Go Back Home</Link>
        </div>
      </div>
    );
  }

export default ErrorPage;
