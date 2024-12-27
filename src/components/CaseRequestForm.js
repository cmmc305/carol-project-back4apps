import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import InputMask from 'react-input-mask';
import Parse from '../config/parseConfig';
import '../CaseRequestForm.css';
import reactLogo from '../assets/react-logo.png';

const CaseRequestForm = () => {
  const [uccFiles, setUccFiles] = useState([]);
  const [transactionProofFiles, setTransactionProofFiles] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx'];

  const handleFileUpload = (event, setter) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      const extension = file.name.split('.').pop().toLowerCase();
      return allowedExtensions.includes(extension);
    });

    if (validFiles.length !== files.length) {
      alert('Some files have unsupported extensions and were not uploaded.');
    }

    setter((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const uploadFileToParse = async (file) => {
    try {
      const parseFile = new Parse.File(file.name, file);
      await parseFile.save();
      return parseFile.url();
    } catch (error) {
      console.error('Error uploading file:', error.message);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <img src={reactLogo} alt="React Logo" className="logo" />
      <h1 className="form-title">Case Request Form</h1>
      <form>
        <label>
          Requester Email:
          <input
            type="email"
            placeholder="Enter requester email"
            value={formData.requesterEmail}
            onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
            required
          />
        </label>
        <label>
          Creditor Name:
          <input
            type="text"
            placeholder="Enter creditor name"
            value={formData.creditorName}
            onChange={(e) => handleInputChange('creditorName', e.target.value)}
            required
          />
        </label>
        <label>
          Business Name:
          <input
            type="text"
            placeholder="Enter business name"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            required
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
            required
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
            placeholder="Enter lien balance (e.g., $0.00)"
            customInput={(props) => <input {...props} />}
            required
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            placeholder="Enter address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            required
          />
        </label>
        <label>
          State:
          <input
            type="text"
            placeholder="Enter state"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            required
          />
        </label>
        <label>
          City:
          <input
            type="text"
            placeholder="Enter city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            required
          />
        </label>
        <label>
          Zipcode:
          <InputMask
            mask="99999-999"
            placeholder="Enter zipcode"
            value={formData.zipcode}
            onChange={(e) => handleInputChange('zipcode', e.target.value)}
            required
          />
        </label>
        <label>
          Phone Number:
          <InputMask
            mask="(99) 99999-9999"
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            required
          />
        </label>
        <label>
          UCC Files:
          <input
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e, setUccFiles)}
          />
        </label>
        <label>
          Transaction Proof Files:
          <input
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e, setTransactionProofFiles)}
          />
        </label>
        <button
          type="button"
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      <footer className="footer">
        &copy; 2024 Your Company Name. All rights reserved.
      </footer>
    </div>
  );
};

export default CaseRequestForm;
