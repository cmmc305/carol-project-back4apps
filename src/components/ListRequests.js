import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Button, Accordion } from 'react-bootstrap';
import Parse from '../config/parseConfig';
import '../css/App.css';
import '../css/ListRequests.css'; // Certifique-se de que o caminho do CSS está correto.

const ListRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const query = new Parse.Query('CaseRequest');
        const results = await query.find();
        setRequests(results);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleEdit = (requestId) => {
    window.location.href = `/create-request/${requestId}`;
  };

  return (
    <Container className="list-requests-container mt-4">
      <h1 className="text-center list-requests-title mb-4">List of Requests</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" className="list-requests-spinner">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading requests...</p>
        </div>
      ) : requests.length > 0 ? (
        <div className="list-requests-table-wrapper">
          <Table striped bordered hover responsive className="list-requests-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Requester Email</th>
                <th>Creditor Name</th>
                <th>Business Name</th>
                <th>Request Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.get('requesterEmail')}</td>
                  <td>{request.get('creditorName')}</td>
                  <td>{request.get('businessName')}</td>
                  <td>{request.get('requestType')}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="list-requests-edit-btn"
                      onClick={() => handleEdit(request.id)}
                    >
                      ✏️ Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Accordion className="list-requests-accordion mt-3">
            {requests.map((request, index) => (
              <Accordion.Item
                eventKey={index.toString()}
                key={index}
                className="list-requests-accordion-item"
              >
                <Accordion.Header>
                  Details for ID: {request.id}
                </Accordion.Header>
                <Accordion.Body>
                  <p>
                    <strong>Address:</strong> {request.get('address')}
                  </p>
                  <p>
                    <strong>State:</strong> {request.get('state')}
                  </p>
                  <p>
                    <strong>City:</strong> {request.get('city')}
                  </p>
                  <p>
                    <strong>Zipcode:</strong> {request.get('zipcode')}
                  </p>
                  <p>
                    <strong>Phone Number:</strong> {request.get('phoneNumber')}
                  </p>
                  <p>
                    <strong>Lien Balance:</strong> $
                    {parseFloat(request.get('lienBalance') || 0).toFixed(2)}
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      ) : (
        <p className="text-center">No requests found</p>
      )}
    </Container>
  );
};

export default ListRequests;
