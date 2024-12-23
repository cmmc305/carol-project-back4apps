import React, { useState } from 'react';
import Parse from '../config/parseConfig';
import './CaseRequestForm.css';

const CaseRequestForm = () => {
  const [uccFiles, setUccFiles] = useState([]);
  const [transactionProofFiles, setTransactionProofFiles] = useState([]);
  const [einList, setEinList] = useState(['']);
  const [ssnList, setSsnList] = useState(['']);
  const [formData, setFormData] = useState({
    requesterType: '',
    requesterEmail: '',
    creditorName: '',
    businessName: '',
    doingBusinessAs: '',
    requestType: '',
    lienBalance: '',
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleEinChange = (index, value) => {
    const updatedList = [...einList];
    updatedList[index] = value;
    setEinList(updatedList);
  };

  const handleSsnChange = (index, value) => {
    const updatedList = [...ssnList];
    updatedList[index] = value;
    setSsnList(updatedList);
  };

  const addEin = () => setEinList([...einList, '']);
  const addSsn = () => setSsnList([...ssnList, '']);

  const handleFileUpload = (event, setter) => {
    const files = Array.from(event.target.files);
    setter((prevFiles) => [...prevFiles, ...files]);
  };

  const handleSubmit = async () => {
    try {
      const CaseRequest = new Parse.Object('CaseRequest');
      Object.keys(formData).forEach((key) => {
        CaseRequest.set(key, formData[key]);
      });

      CaseRequest.set('lienBalance', parseFloat(formData.lienBalance));
      CaseRequest.set('uccFiles', uccFiles.map((file) => ({ name: file.name, type: file.type, size: file.size })));
      CaseRequest.set('transactionProofFiles', transactionProofFiles.map((file) => ({ name: file.name, type: file.type, size: file.size })));
      CaseRequest.set('einList', einList);
      CaseRequest.set('ssnList', ssnList);

      await CaseRequest.save();
      alert('Case Request saved successfully!');
      setFormData({
        requesterType: '',
        requesterEmail: '',
        creditorName: '',
        businessName: '',
        doingBusinessAs: '',
        requestType: '',
        lienBalance: '',
      });
      setEinList(['']);
      setSsnList(['']);
      setUccFiles([]);
      setTransactionProofFiles([]);
    } catch (error) {
      console.error('Error saving Case Request:', error);
      alert('Failed to save Case Request. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Case Request Form</h1>
      <div className="form-group">
        <label>Requester Type:</label>
        <input
          type="text"
          value={formData.requesterType}
          onChange={(e) => handleInputChange('requesterType', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Requester Email:</label>
        <input
          type="email"
          value={formData.requesterEmail}
          onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Creditor Name:</label>
        <input
          type="text"
          value={formData.creditorName}
          onChange={(e) => handleInputChange('creditorName', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Business Name:</label>
        <input
          type="text"
          value={formData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Doing Business As:</label>
        <input
          type="text"
          value={formData.doingBusinessAs}
          onChange={(e) => handleInputChange('doingBusinessAs', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Request Type:</label>
        <input
          type="text"
          value={formData.requestType}
          onChange={(e) => handleInputChange('requestType', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Lien Balance:</label>
        <input
          type="number"
          value={formData.lienBalance}
          onChange={(e) => handleInputChange('lienBalance', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>EIN:</label>
        {einList.map((ein, index) => (
          <input
            key={`ein-${index}`}
            type="text"
            value={ein}
            onChange={(e) => handleEinChange(index, e.target.value)}
          />
        ))}
        <button type="button" className="add-btn" onClick={addEin}>
          + Add EIN
        </button>
      </div>

      <div className="form-group">
        <label>SSN:</label>
        {ssnList.map((ssn, index) => (
          <input
            key={`ssn-${index}`}
            type="text"
            value={ssn}
            onChange={(e) => handleSsnChange(index, e.target.value)}
          />
        ))}
        <button type="button" className="add-btn" onClick={addSsn}>
          + Add SSN
        </button>
      </div>

      <div className="form-group">
        <label>UCC Files:</label>
        <input type="file" multiple onChange={(e) => handleFileUpload(e, setUccFiles)} />
      </div>

      <div className="form-group">
        <label>Transaction Proof Files:</label>
        <input type="file" multiple onChange={(e) => handleFileUpload(e, setTransactionProofFiles)} />
      </div>

      <button type="button" className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default CaseRequestForm;
