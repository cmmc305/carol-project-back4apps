import React, { useState, useEffect } from 'react';
import Parse from '../config/parseConfig';
import '../css/App.css';

const CaseRequestForm = () => {
  const [uccFiles, setUccFiles] = useState([]);
  const [transactionProofFiles, setTransactionProofFiles] = useState([]);
  const [einList, setEinList] = useState(['']);
  const [ssnList, setSsnList] = useState(['']);
  const [formData, setFormData] = useState({
    requesterEmail: '',
    creditorName: '',
    businessName: '',
    doingBusinessAs: '',
    requestType: '',
    lienBalance: '',
    additionalEntities: '',
    defaultDate: '',
    address: '',
    state: '',
    city: '',
    zipcode: '',
    emailAddress: '',
    phoneNumber: ''
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
        requesterEmail: '',
        creditorName: '',
        businessName: '',
        doingBusinessAs: '',
        requestType: '',
        lienBalance: '',
        additionalEntities: '',
        defaultDate: '',
        address: '',
        state: '',
        city: '',
        zipcode: '',
        emailAddress: '',
        phoneNumber: ''
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
      <h1>Case Request Form</h1>

      <label>
        Requester Email:
        <input
          type="email"
          value={formData.requesterEmail}
          onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
        />
      </label>

      <label>
        Request Type:
        <select
          value={formData.requestType}
          onChange={(e) => handleInputChange('requestType', e.target.value)}
        >
          <option value="">Select Request Type</option>
          <option value="Lien">Lien</option>
          <option value="Garnishment">Garnishment</option>
          <option value="Release">Release</option>
        </select>
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
        City:
        <input
          type="text"
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
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
        Zip Code:
        <input
          type="text"
          value={formData.zipcode}
          onChange={(e) => handleInputChange('zipcode', e.target.value)}
        />
      </label>

      <label>
        Email Address:
        <input
          type="email"
          value={formData.emailAddress}
          onChange={(e) => handleInputChange('emailAddress', e.target.value)}
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
        Default Date:
        <input
          type="date"
          value={formData.defaultDate}
          onChange={(e) => handleInputChange('defaultDate', e.target.value)}
        />
      </label>

      <label>
        Additional Entities:
        <textarea
          value={formData.additionalEntities}
          onChange={(e) => handleInputChange('additionalEntities', e.target.value)}
        ></textarea>
      </label>

      <label>
        EIN:
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
      </label>

      <label>
        SSN:
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
    </div>
  );
};

export default CaseRequestForm;
