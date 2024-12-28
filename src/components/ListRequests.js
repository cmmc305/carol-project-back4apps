import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Button } from 'react-bootstrap';
import Parse from '../config/parseConfig';
import '../css/App.css';
import '../css/ListRequests.css';

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
                const address = request.get('address');
                const city = request.get('city');
                const state = request.get('state');
                const zipcode = request.get('zipcode');
                const phoneNumber = request.get('phoneNumber');
                const lienBalance = parseFloat(request.get('lienBalance') || 0).toFixed(2);

                return (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.get('requesterEmail')}</td>
                    <td>{request.get('creditorName')}</td>
                    <td>{request.get('businessName')}</td>
                    <td>{request.get('requestType')}</td>
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
                        className="list-requests-edit-btn"
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
        <p className="text-center">No requests found</p>
      )}
    </Container>
  );
};

export default ListRequests;
