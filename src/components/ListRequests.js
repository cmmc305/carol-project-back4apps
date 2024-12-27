import React, { useEffect, useState } from 'react';
import Parse from '../config/parseConfig';
import '../ListRequests.css';

const ListRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true); // Adicionado para feedback de carregamento

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
    // Redireciona para a página de edição, passando o ID do request
    window.location.href = `/update-request/${requestId}`;
  };

  return (
    <div className="list-requests-container">
      <h1 className="title">List of Requests</h1>
      {loading ? (
        <p className="loading-message">Loading requests...</p>
      ) : requests.length > 0 ? (
        <table className="requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Requester Email</th>
              <th>Creditor Name</th>
              <th>Business Name</th>
              <th>Doing Business As</th>
              <th>Request Type</th>
              <th>Additional Entities</th>
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
                <td>{request.get('additionalEntities')}</td>
                <td>{request.get('address')}</td>
                <td>{request.get('state')}</td>
                <td>{request.get('city')}</td>
                <td>{request.get('zipcode')}</td>
                <td>{request.get('phoneNumber')}</td>
                <td>
                  ${parseFloat(request.get('lienBalance') || 0).toFixed(2)}
                </td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(request.id)}
                  >
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data">No requests found</p>
      )}
    </div>
  );
};

export default ListRequests;
