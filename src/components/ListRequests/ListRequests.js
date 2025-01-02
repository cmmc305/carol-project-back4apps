// src/components/ListRequests/ListRequests.js

import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Button, Alert, Modal } from 'react-bootstrap';
import Parse from '../../config/parseConfig';
import styles from './ListRequests.module.css';
import { useNavigate } from 'react-router-dom';

const ListRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null); // ID of the request being deleted
  const [showConfirm, setShowConfirm] = useState(false); // Control for confirmation modal
  const [selectedRequest, setSelectedRequest] = useState(null); // Selected request to delete
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
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
    navigate(`/app/create-request/${requestId}`); // Navigate to edit page
  };

  const handleDelete = (request) => {
    setSelectedRequest(request);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedRequest) return;
    const requestId = selectedRequest.id;
    setDeletingId(requestId);
    setError('');
    setSuccess('');

    try {
      const query = new Parse.Query('CaseRequest');
      const caseRequest = await query.get(requestId);
      await caseRequest.destroy();

      // Update local state by removing the deleted request
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );

      setSuccess('Request successfully deleted.');
    } catch (err) {
      console.error('Error deleting request:', err);
      setError('Failed to delete the request. Please try again.');
    } finally {
      setDeletingId(null);
      setShowConfirm(false);
      setSelectedRequest(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedRequest(null);
  };

  return (
    <Container className={styles.listRequestsContainer}>
      <h1 className={`text-center ${styles.title}`}>List of Requests</h1>

      {/* Error or Success Alerts */}
      {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}
      {success && <Alert variant="success" className={styles.alert}>{success}</Alert>}

      {/* Loading Indicator */}
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
                      className={`${styles.editButton} me-2`}
                      onClick={() => handleEdit(request.id)}
                      disabled={deletingId === request.id}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(request)}
                      disabled={deletingId === request.id}
                    >
                      {deletingId === request.id ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : (
                        '🗑️ Delete'
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <p className={`text-center ${styles.noData}`}>No requests found.</p>
      )}

      {/* Confirmation Modal for Deletion */}
      <Modal show={showConfirm} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <p>
              Are you sure you want to delete the request from{' '}
              <strong>{selectedRequest.get('requesterEmail')}</strong>?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={deletingId === selectedRequest?.id}
          >
            {deletingId === selectedRequest?.id ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{' '}
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListRequests;
