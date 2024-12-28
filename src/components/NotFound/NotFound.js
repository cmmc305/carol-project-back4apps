// src/components/NotFound/NotFound.js

import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css'; // Importa o CSS Module

const NotFound = () => {
  return (
    <Container className={styles.notFoundContainer}>
      <div className={styles.notFoundBox}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>Page Not Found</p>
        <Link to="/" className={styles.homeLink}>
          Go to Home
        </Link>
      </div>
    </Container>
  );
};

export default NotFound;
