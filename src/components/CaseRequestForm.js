import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import Parse from '../config/parseConfig';
import '../CaseRequestForm.css';
import ReactLogo from '../assets/react-logo.png'; // Certifique-se de adicionar o logo do React à pasta `assets`

const CaseRequestForm = () => {
  const [uccFiles, setUccFiles] = useState([]);
  const [transactionProofFiles, setTransactionProofFiles] = useState([]);
  const [formData, setFormData] = useState({
    requesterType: '',
    requesterEmail: '',
    creditorName: '',
    businessName: '',
    doingBusinessAs: '',
    requestType: '',
    lienBalance: '',
    additionalEntities: '',
    address: '',
    state: '',
    city: '',
    zipcode: '',
    phoneNumber: '',
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (event, setter) => {
    const files = Array.from(event.target.files);
    setter((prevFiles) => [...prevFiles, ...files]);
  };

  const uploadFileToParse = async (file) => {
    try {
      const parseFile = new Parse.File(file.name, file);
      await parseFile.save();
      return parseFile.url();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      const uploadedUccFiles = await Promise.all(
        uccFiles.map((file) => uploadFileToParse(file))
      );
      const uploadedTransactionProofFiles = await Promise.all(
        transactionProofFiles.map((file) => uploadFileToParse(file))
      );

      const CaseRequest = new Parse.Object('CaseRequest');
      Object.keys(formData).forEach((key) => {
        CaseRequest.set(key, formData[key]);
      });

      CaseRequest.set('uccFiles', uploadedUccFiles);
      CaseRequest.set('transactionProofFiles', uploadedTransactionProofFiles);

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
        additionalEntities: '',
        address: '',
        state: '',
        city: '',
        zipcode: '',
        phoneNumber: '',
      });
      setUccFiles([]);
      setTransactionProofFiles([]);
    } catch (error) {
      console.error('Error saving Case Request:', error);
      alert('Failed to save Case Request. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h1>Case Request Form</h1>    
      <label>
        Requester Email:
      </div>
      <div className="form-group">
        <label>Requester Email:</label>
        <input
          type="email"
          value={formData.requesterEmail}
          onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
        />
      </label>
      <label>
        Creditor Name:
      </div>
      <div className="form-group">
        <label>Creditor Name:</label>
        <input
          type="text"
          value={formData.creditorName}
          onChange={(e) => handleInputChange('creditorName', e.target.value)}
        />
      </label>
      <label>
        Business Name:
      </div>
      <div className="form-group">
        <label>Business Name:</label>
        <input
          type="text"
          value={formData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
        />
      </label>
      <label>
        Doing Business As:
      </div>
      <div className="form-group">
        <label>Doing Business As:</label>
        <input
          type="text"
          value={formData.doingBusinessAs}
          onChange={(e) => handleInputChange('doingBusinessAs', e.target.value)}
        />
      </label>
      <label>
        Request Type:
      </div>
      <div className="form-group">
        <label>Request Type:</label>
        <select
          value={formData.requestType}
          onChange={(e) => handleInputChange('requestType', e.target.value)}
@@ -143,63 +139,36 @@ const CaseRequestForm = () => {
          <option value="Garnishment">Garnishment</option>
          <option value="Release">Release</option>
        </select>
      </label>
      <label>
        Additional Entities:
        <textarea
          value={formData.additionalEntities}
          onChange={(e) => handleInputChange('additionalEntities', e.target.value)}
      </div>
      <div className="form-group">
        <label>Lien Balance:</label>
        <InputMask
          mask="99999.99"
          value={formData.lienBalance}
          onChange={(e) => handleInputChange('lienBalance', e.target.value)}
        />
      </label>
      <label>
        Address:
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
      </label>
      <label>
        State:
        <input
          type="text"
          value={formData.state}
          onChange={(e) => handleInputChange('state', e.target.value)}
        />
      </label>
      <label>
        City:
        <input
          type="text"
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
      </div>
      <div className="form-group">
        <label>Phone Number:</label>
        <InputMask
          mask="(999) 999-9999"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
        />
      </label>
      <label>
        Zipcode:
        <input
          type="text"
      </div>
      <div className="form-group">
        <label>Zipcode:</label>
        <InputMask
          mask="99999-999"
          value={formData.zipcode}
          onChange={(e) => handleInputChange('zipcode', e.target.value)}
        />
      </label>
      <label>
        Phone Number:
        <input
          type="text"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
        />
      </label>
      <label>
        UCC Files:
      </div>
      <div className="form-group">
        <label>UCC Files:</label>
        <input type="file" multiple onChange={(e) => handleFileUpload(e, setUccFiles)} />
      </label>
      <label>
        Transaction Proof Files:
        <input type="file" multiple onChange={(e) => handleFileUpload(e, setTransactionProofFiles)} />
      </label>
      <button type="button" className="submit-btn" onClick={handleSubmit}>
      </div>
      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default CaseRequestForm;
