import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Parse from '../config/parseConfig';

const UpdateRequestForm = () => {
  const { id } = useParams(); // Obter o ID da URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const query = new Parse.Query('CaseRequest');
        const request = await query.get(id);

        setFormData({
          requesterEmail: request.get('requesterEmail'),
          creditorName: request.get('creditorName'),
          businessName: request.get('businessName'),
          doingBusinessAs: request.get('doingBusinessAs'),
          requestType: request.get('requestType'),
          lienBalance: request.get('lienBalance'),
          address: request.get('address'),
          state: request.get('state'),
          city: request.get('city'),
          zipcode: request.get('zipcode'),
          phoneNumber: request.get('phoneNumber'),
        });
      } catch (err) {
        console.error('Error fetching request:', err);
        setError('Failed to load the request. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const query = new Parse.Query('CaseRequest');
      const request = await query.get(id);

      Object.keys(formData).forEach((key) => {
        request.set(key, formData[key]);
      });

      await request.save();
      alert('Request updated successfully!');
      navigate('/list-requests'); // Redireciona para a lista de requests
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update the request. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Update Request</h1>
      <label>
        Requester Email:
        <input
          type="email"
          value={formData.requesterEmail || ''}
          onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
        />
      </label>
      <label>
        Creditor Name:
        <input
          type="text"
          value={formData.creditorName || ''}
          onChange={(e) => handleInputChange('creditorName', e.target.value)}
        />
      </label>
      <label>
        Business Name:
        <input
          type="text"
          value={formData.businessName || ''}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
        />
      </label>
      {/* Adicione outros campos aqui */}
      <button onClick={handleUpdate}>Save Changes</button>
    </div>
  );
};

export default UpdateRequestForm;
