import React, { useState } from 'react';
import Parse from '../config/parseConfig';

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
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Case Request Form</h1>
      <label>
        Requester Type:
        <input
          type="text"
          value={formData.requesterType}
          onChange={(e) => handleInputChange('requesterType', e.target.value)}
        />
      </label>

      <label>
        Requester Email:
        <input
          type="email"
          value={formData.requesterEmail}
          onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
        />
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
