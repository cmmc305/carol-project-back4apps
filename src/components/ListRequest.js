import React, { useEffect, useState } from 'react';
import Parse from '../config/parseConfig';

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
    <div>
      <h1>List of Requests</h1>
      <ul>
        {requests.map((request) => (
          <li key={request.id}>
            <strong>Requester:</strong> {request.get('requesterEmail')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListRequests;
