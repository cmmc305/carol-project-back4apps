// src/components/ListRequests/ListRequests.js

import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Button, Alert } from 'react-bootstrap';
import Parse from '../../config/parseConfig';
import styles from './ListRequests.module.css'; // Importa o CSS Module
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
    navigate(`/create-request/${requestId}`);
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
          <Table striped bordered hover responsive className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Requester Email</th>
                <th>Creditor Name</th>
                <th>Business Name</th>
                <th>Request Type</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Zipcode</th>
                <th>Phone</th>
                <th>Lien Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                const address = request.get('address') || '-';
                const city = request.get('city') || '-';
                const state = request.get('state') || '-';
                const zipcode = request.get('zipcode') || '-';
                const phoneNumber = request.get('phoneNumber') || '-';
                const lienBalance = parseFloat(request.get('lienBalance') || 0).toFixed(2);

                return (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.get('requesterEmail') || '-'}</td>
                    <td>{request.get('creditorName') || '-'}</td>
                    <td>{request.get('businessName') || '-'}</td>
                    <td>{request.get('requestType') || '-'}</td>
                    <td>{address}</td>
                    <td>{city}</td>
                    <td>{state}</td>
                    <td>{zipcode}</td>
                    <td>{phoneNumber}</td>
                    <td>{`$ ${lienBalance}`}</td>
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
                );
              })}
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
