import React, { useState } from 'react';
import Parse from '../config/parseConfig';

const UpdateRequest = () => {
  const [requestId, setRequestId] = useState('');
  const [updatedData, setUpdatedData] = useState({});

  const handleUpdate = async () => {
    try {
      const query = new Parse.Query('CaseRequest');
      const request = await query.get(requestId);
      Object.keys(updatedData).forEach((key) => {
        request.set(key, updatedData[key]);
      });
      await request.save();
      alert('Request updated successfully!');
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  return (
    <div>
      <h1>Update Request</h1>
      <input
        type="text"
        placeholder="Request ID"
        value={requestId}
        onChange={(e) => setRequestId(e.target.value)}
      />
      <textarea
        placeholder="Updated Data (JSON)"
        value={JSON.stringify(updatedData)}
        onChange={(e) => setUpdatedData(JSON.parse(e.target.value))}
      />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default UpdateRequest;
