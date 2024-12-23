import React, { useState } from 'react';
import Parse from '../config/parseConfig';
import '../CaseRequestForm.css'; // Certifique-se de ter o CSS para estilos

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
    additionalEntities: '',
    address: '',
    state: '',
    city: '',
    zipcode: '',
    emailAddress: '',
    phoneNumber: '',
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

  const resetForm = () => {
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
      emailAddress: '',
      phoneNumber: '',
    });
    setEinList(['']);
    setSsnList(['']);
    setUccFiles([]);
    setTransactionProofFiles([]);
  };

  const handleSubmit = async () => {
    try {
      const CaseRequest = new Parse.Object('CaseRequest');
      Object.keys(formData).forEach((key) => {
        CaseRequest.set(key, formData[key]);
      });

      const uccParseFiles = await Promise.all(
        uccFiles.map(async (file) => {
          const parseFile = new Parse.File(file.name, file);
          await parseFile.save();
          return parseFile;
        })
      );

      const transactionParseFiles = await Promise.all(
        transactionProofFiles.map(async (file) => {
          const parseFile = new Parse.File(file.name, file);
          await parseFile.save();
          return parseFile;
        })
      );

      CaseRequest.set('uccFiles', uccParseFiles);
      CaseRequest.set('transactionProofFiles', transactionParseFiles);
      CaseRequest.set('lienBalance', parseFloat(formData.lienBalance));
      CaseRequest.set('einList', einList);
      CaseRequest.set('ssnList', ssnList);

      await CaseRequest.save();
      alert('Case Request saved successfully!');
      resetForm();
    } catch (error) {
      console.error('Error saving Case Request:', error);
      alert('Failed to save Case Request. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h1>Case Request Form</h1>

      <label>Requester Type:</label>
      <input
        type="text"
        value={formData.requesterType}
        onChange={(e) => handleInputChange('requesterType', e.target.value)}
      />

      <label>Requester Email:</label>
      <input
        type="email"
        value={formData.requesterEmail}
        onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
      />

      <label>Creditor Name:</label>
      <input
        type="text"
        value={formData.creditorName}
        onChange={(e) => handleInputChange('creditorName', e.target.value)}
      />

      <label>Business Name:</label>
      <input
        type="text"
        value={formData.businessName}
        onChange={(e) => handleInputChange('businessName', e.target.value)}
      />

      <label>Doing Business As:</label>
      <input
        type="text"
        value={formData.doingBusinessAs}
        onChange={(e) => handleInputChange('doingBusinessAs', e.target.value)}
      />

      <label>Request Type:</label>
      <select
        value={formData.requestType}
        onChange={(e) => handleInputChange('requestType', e.target.value)}
      >
        <option value="">Select Request Type</option>
        <option value="Lien">Lien</option>
        <option value="Garnishment">Garnishment</option>
        <option value="Release">Release</option>
      </select>

      <label>Lien Balance:</label>
      <input
        type="number"
        value={formData.lienBalance}
        onChange={(e) => handleInputChange('lienBalance', e.target.value)}
      />

      <label>Additional Entities:</label>
      <textarea
        value={formData.additionalEntities}
        onChange={(e) => handleInputChange('additionalEntities', e.target.value)}
      ></textarea>

      <label>Address:</label>
      <input
        type="text"
        value={formData.address}
        onChange={(e) => handleInputChange('address', e.target.value)}
      />

      <label>State:</label>
      <input
        type="text"
        value={formData.state}
        onChange={(e) => handleInputChange('state', e.target.value)}
      />

      <label>City:</label>
      <input
        type="text"
        value={formData.city}
        onChange={(e) => handleInputChange('city', e.target.value)}
      />

      <label>Zipcode:</label>
      <input
        type="text"
        value={formData.zipcode}
        onChange={(e) => handleInputChange('zipcode', e.target.value)}
      />

      <label>Email Address:</label>
      <input
        type="email"
        value={formData.emailAddress}
        onChange={(e) => handleInputChange('emailAddress', e.target.value)}
      />

      <label>Phone Number:</label>
      <input
        type="tel"
        value={formData.phoneNumber}
        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
      />

      <label>UCC Files:</label>
      <input type="file" multiple onChange={(e) => handleFileUpload(e, setUccFiles)} />

      <label>Transaction Proof Files:</label>
      <input type="file" multiple onChange={(e) => handleFileUpload(e, setTransactionProofFiles)} />

      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default CaseRequestForm;
