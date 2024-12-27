import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format'; 
import InputMask from 'react-input-mask';
import Parse from '../config/parseConfig';
import '../CaseRequestForm.css';
import reactLogo from '../assets/react-logo.png';

const CaseRequestForm = () => {
  const { id } = useParams(); // Verifica se há um ID na URL (modo edição)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    requesterEmail: '',
    creditorName: '',
    businessName: '',
    doingBusinessAs: '',
    requestType: '',
    lienBalance: '',
    address: '',
    state: '',
    city: '',
    zipcode: '',
    phoneNumber: '',
  });
  const [uccFiles, setUccFiles] = useState([]);
  const [transactionProofFiles, setTransactionProofFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar dados existentes para edição
  useEffect(() => {
    const fetchRequestData = async () => {
      if (id) {
        setLoading(true);
        try {
          const query = new Parse.Query('CaseRequest');
          const request = await query.get(id);

          setFormData({
            requesterEmail: request.get('requesterEmail') || '',
            creditorName: request.get('creditorName') || '',
            businessName: request.get('businessName') || '',
            doingBusinessAs: request.get('doingBusinessAs') || '',
            requestType: request.get('requestType') || '',
            lienBalance: request.get('lienBalance') || '',
            address: request.get('address') || '',
            state: request.get('state') || '',
            city: request.get('city') || '',
            zipcode: request.get('zipcode') || '',
            phoneNumber: request.get('phoneNumber') || '',
          });

          // Exemplo: Carregar arquivos salvos (caso necessário)
          setUccFiles(request.get('uccFiles') || []);
          setTransactionProofFiles(request.get('transactionProofFiles') || []);
        } catch (error) {
          console.error('Error fetching request:', error);
          alert('Failed to load request data.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRequestData();
  }, [id]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (event, setter) => {
    const files = Array.from(event.target.files);
    setter((prevFiles) => [...prevFiles, ...files]);
  };

  const uploadFileToParse = async (file) => {
    const parseFile = new Parse.File(file.name, file);
    await parseFile.save();
    return parseFile.url();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const uploadedUccFiles = await Promise.all(
        uccFiles.map((file) => uploadFileToParse(file))
      );

      const uploadedTransactionProofFiles = await Promise.all(
        transactionProofFiles.map((file) => uploadFileToParse(file))
      );

      let CaseRequest;

      if (id) {
        // Atualizar request existente
        const query = new Parse.Query('CaseRequest');
        CaseRequest = await query.get(id);
      } else {
        // Criar novo request
        CaseRequest = new Parse.Object('CaseRequest');
      }

      Object.keys(formData).forEach((key) => {
        CaseRequest.set(key, formData[key]);
      });

      CaseRequest.set('uccFiles', uploadedUccFiles);
      CaseRequest.set('transactionProofFiles', uploadedTransactionProofFiles);

      await CaseRequest.save();

      alert(id ? 'Request updated successfully!' : 'Request created successfully!');
      navigate('/list-requests'); // Redirecionar para a lista
    } catch (error) {
      console.error('Error saving request:', error);
      alert('Failed to save request.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="form-container">
      <img src={reactLogo} alt="React Logo" className="logo" />
      <h1 className="form-title">{id ? 'Update Request' : 'Create Request'}</h1>
      <label>
        Requester Email:
        <input
          type="email"
          placeholder="Enter requester email"
          value={formData.requesterEmail}
          onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
        />
      </label>
      <label>
        Creditor Name:
        <input
          type="text"
          placeholder="Enter creditor name"
          value={formData.creditorName}
          onChange={(e) => handleInputChange('creditorName', e.target.value)}
        />
      </label>
      <label>
        Business Name:
        <input
          type="text"
          placeholder="Enter business name"
          value={formData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
        />
      </label>
      {/* Restante dos campos */}
      <button className="submit-btn" onClick={handleSubmit}>
        {id ? 'Save Changes' : 'Create Request'}
      </button>
    </div>
  );
};

export default CaseRequestForm;
