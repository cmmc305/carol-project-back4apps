// src/components/ListRequests/ListRequests.js

import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Button, Alert } from 'react-bootstrap';
import Parse from '../../config/parseConfig';
import styles from './ListRequests.module.css';
import { useNavigate } from 'react-router-dom';

const ListRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const query = new Parse.Query('CaseRequest');
        const results = await query.find();
        setRequests(results);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Failed to fetch requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleEdit = (requestId) => {
    navigate(`/app/create-request/${requestId}`); // Adicione o prefixo "/app" para corresponder à rota configurada
  };

  return (
    <Container className={styles.listRequestsContainer}>
      <h1 className={`text-center ${styles.title}`}>List of Requests</h1>

      {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}

      {loading ? (
        <div className={`text-center ${styles.loading}`}>
          <Spinner animation="border" role="status" className={styles.spinner}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading requests...</p>
        </div>
      ) : requests.length > 0 ? (
        <div className={styles.tableWrapper}>
          <Table
            striped
            bordered
            hover
            responsive
            size="sm"
            className={styles.table}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Creditor</th>
                <th>Type</th>
                <th>City</th>
                <th>Phone</th>
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id.slice(-6)}</td>
                  <td>{request.get('requesterEmail') || '-'}</td>
                  <td>{request.get('creditorName') || '-'}</td>
                  <td>{request.get('requestType') || '-'}</td>
                  <td>{request.get('city') || '-'}</td>
                  <td>{request.get('phoneNumber') || '-'}</td>
                  <td>{`$${parseFloat(request.get('lienBalance') || 0).toFixed(2)}`}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className={styles.editButton}
                      onClick={() => handleEdit(request.id)}
                    >
                      ✏️ Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <p className={`text-center ${styles.noData}`}>No requests found</p>
      )}
    </Container>
  );
};

export default ListRequests;
