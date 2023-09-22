// Search.jsx
import React from 'react';
import { Form, Container } from 'react-bootstrap';
import styles from '../../styles/Search.module.css';

function Search({ onSearch }) {
  return (
    <Container fluid className={styles.searchContainer}>
      <Form.Control
        type="text"
        placeholder="Search for venues by title..."
        onChange={e => onSearch(e.target.value)}
        className={styles.searchInput}
      />
    </Container>
  );
}

export default Search;
