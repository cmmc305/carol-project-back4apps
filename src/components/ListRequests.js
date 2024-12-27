import React, { useEffect, useState } from 'react';
import Parse from '../config/parseConfig';
import './ListRequests.css'; // Adicione este arquivo para estilização

const ListRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const query = new Parse.Query('CaseRequest');
        const results = await query.find();
        setRequests(results);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="list-requests-container">
      <h1 className="title">List of Requests</h1>
      <table className="requests-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Requester Email</th>
            <th>Creditor Name</th>
            <th>Business Name</th>
            <th>City</th>
            <th>State</th>
            <th>Lien Balance</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.get('requesterEmail')}</td>
                <td>{request.get('creditorName')}</td>
                <td>{request.get('businessName')}</td>
                <td>{request.get('city')}</td>
                <td>{request.get('state')}</td>
                <td>{request.get('lienBalance')}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">No requests found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListRequests;
