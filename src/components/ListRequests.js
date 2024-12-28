import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Button } from 'react-bootstrap';
import Parse from '../config/parseConfig';
import '../css/App.css';

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
    <Container className="mt-4">
      <h1 className="text-center mb-4">List of Requests</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading requests...</p>
        </div>
      ) : requests.length > 0 ? (
        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Requester Email</th>
              <th>Creditor Name</th>
              <th>Business Name</th>
              <th>Doing Business As</th>
              <th>Request Type</th>
              <th>Address</th>
              <th>State</th>
              <th>City</th>
              <th>Zipcode</th>
              <th>Phone Number</th>
              <th>Lien Balance</th>
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
                <td>{request.get('doingBusinessAs')}</td>
                <td>{request.get('requestType')}</td>
                <td>{request.get('address')}</td>
                <td>{request.get('state')}</td>
                <td>{request.get('city')}</td>
                <td>{request.get('zipcode')}</td>
                <td>{request.get('phoneNumber')}</td>
                <td>${parseFloat(request.get('lienBalance') || 0).toFixed(2)}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(request.id)}
                  >
                    ✏️ Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center">No requests found</p>
      )}
    </Container>
  );
};

export default ListRequests;
