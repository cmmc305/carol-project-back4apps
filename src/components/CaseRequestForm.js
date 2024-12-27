import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format'; 
import InputMask from 'react-input-mask';
import Parse from '../config/parseConfig';
import '../CaseRequestForm.css';
import reactLogo from '../assets/react-logo.png';

const CaseRequestForm = () => {
  const { id } = useParams(); // Detecta o modo (edição/criação)
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

  // Carrega dados se estiver no modo edição
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
    setter(files); // Substitui os arquivos antigos pelos novos
  };

  const uploadFileToParse = async (file) => {
    const parseFile = new Parse.File(file.name, file);
    await parseFile.save();
    return parseFile.url();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
  
      const uploadedUccFiles = uccFiles.length
        ? await Promise.all(uccFiles.map((file) => uploadFileToParse(file)))
        : [];
  
      const uploadedTransactionProofFiles = transactionProofFiles.length
        ? await Promise.all(transactionProofFiles.map((file) => uploadFileToParse(file)))
        : [];
  
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
      navigate('/list-requests');
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
      <label>
        Doing Business As:
        <input
          type="text"
          placeholder="Enter doing business as"
          value={formData.doingBusinessAs}
          onChange={(e) => handleInputChange('doingBusinessAs', e.target.value)}
        />
      </label>
      <label>
        Request Type:
        <select
          value={formData.requestType}
          onChange={(e) => handleInputChange('requestType', e.target.value)}
        >
          <option value="">Select request type</option>
          <option value="Lien">Lien</option>
          <option value="Garnishment">Garnishment</option>
          <option value="Release">Release</option>
        </select>
      </label>
      <label>
        Lien Balance:
        <NumericFormat
          value={formData.lienBalance}
          onValueChange={(values) => handleInputChange('lienBalance', values.value)}
          thousandSeparator=","
          prefix="$"
          placeholder="Enter lien balance"
        />
      </label>
      <label>
        Address:
        <input
          type="text"
          placeholder="Enter address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
      </label>
      <label>
        State:
        <input
          type="text"
          placeholder="Enter state"
          value={formData.state}
          onChange={(e) => handleInputChange('state', e.target.value)}
        />
      </label>
      <label>
        City:
        <input
          type="text"
          placeholder="Enter city"
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
        />
      </label>
      <label>
        Zipcode:
        <InputMask
          mask="99999"
          placeholder="Enter ZIP code (e.g., 12345)"
          value={formData.zipcode}
          onChange={(e) => handleInputChange('zipcode', e.target.value)}
        />
      </label>
      <label>
        Phone Number:
        <InputMask
          mask="(999) 999-9999"
          placeholder="Enter phone number (e.g., (555) 123-4567)"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
        />
      </label>
      <label>
  UCC Files:
  <input
    type="file"
    multiple
    onChange={(e) => {
      // Substituir arquivos antigos por novos
      handleFileUpload(e, setUccFiles);
    }}
  />
</label>
<ul>
  {uccFiles.length > 0 &&
    uccFiles.map((file, index) => {
      const fileName = typeof file === 'string' ? file.split('/').pop() : 'Unknown File';
      return (
        <li key={index}>
          <a
            href={typeof file === 'string' ? file : '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            {fileName}
          </a>
        </li>
      );
    })}
</ul>

<label>
  Transaction Proof Files:
  <input
    type="file"
    multiple
    onChange={(e) => {
      // Substituir arquivos antigos por novos
      handleFileUpload(e, setTransactionProofFiles);
    }}
  />
</label>
<ul>
  {transactionProofFiles.length > 0 &&
    transactionProofFiles.map((file, index) => {
      const fileName = typeof file === 'string' ? file.split('/').pop() : 'Unknown File';
      return (
        <li key={index}>
          <a
            href={typeof file === 'string' ? file : '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            {fileName}
          </a>
        </li>
      );
    })}
</ul>
      <button className="submit-btn" onClick={handleSubmit}>
        {id ? 'Save Changes' : 'Create Request'}
      </button>
    </div>
  );
};

export default CaseRequestForm;
