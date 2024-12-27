import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import Parse from '../config/parseConfig';
import '../CaseRequestForm.css';
import reactLogo from '../assets/react-logo.png';

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
      <img src={reactLogo} alt="React Logo" className="logo" />
      <h1 className="form-title">Case Request Form</h1>    
      <label>
        Requester Email:
        <input
          type="email"
          value={formData.requesterEmail}
          onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
        />
      </label>
      <label>
        Creditor Name:
        <input
          type="text"
          value={formData.creditorName}
          onChange={(e) => handleInputChange('creditorName', e.target.value)}
        />
      </label>
      <label>
        Business Name:
        <input
          type="text"
          value={formData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
        />
      </label>
      <label>
        Doing Business As:
        <input
          type="text"
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
          <option value="">Select</option>
          <option value="Lien">Lien</option>
          <option value="Garnishment">Garnishment</option>
          <option value="Release">Release</option>
        </select>
      </label>
      <label>
        Lien Balance:
        <InputMask
          mask="currency"
          value={formData.lienBalance}
          onChange={(e) => handleInputChange('lienBalance', e.target.value)}
          placeholder="0.00"
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
        />
      </label>
      <label>
        Zipcode:
        <InputMask
          mask="99999-999"
          value={formData.zipcode}
          onChange={(e) => handleInputChange('zipcode', e.target.value)}
        />
      </label>
      <label>
        Phone Number:
        <InputMask
          mask="(99) 99999-9999"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
        />
      </label>
      <label>
        UCC Files:
        <input type="file" multiple onChange={(e) => handleFileUpload(e, setUccFiles)} />
      </label>
      <label>
        Transaction Proof Files:
        <input type="file" multiple onChange={(e) => handleFileUpload(e, setTransactionProofFiles)} />
      </label>
      <button type="button" className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
      <footer className="footer">
        &copy; 2024 Your Company Name. All rights reserved.
      </footer>
    </div>
  );
};

export default CaseRequestForm;
