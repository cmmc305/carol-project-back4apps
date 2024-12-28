import React, { useState } from 'react';
import Parse from '../config/parseConfig';
import { Container, Form, Button, Row, Col, InputGroup } from 'react-bootstrap';

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
    setter(files);
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
        phoneNumber: '',
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
    <Container className="mt-4">
      <h1 className="text-center">Case Request Form</h1>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="requesterEmail">
              <Form.Label>Requester Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter requester email"
                value={formData.requesterEmail}
                onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="requestType">
              <Form.Label>Request Type</Form.Label>
              <Form.Select
                value={formData.requestType}
                onChange={(e) => handleInputChange('requestType', e.target.value)}
              >
                <option value="">Select Request Type</option>
                <option value="Lien">Lien</option>
                <option value="Garnishment">Garnishment</option>
                <option value="Release">Release</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        {/* Repeat similar structure for other fields */}
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3" controlId="additionalEntities">
              <Form.Label>Additional Entities</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter additional entities"
                value={formData.additionalEntities}
                onChange={(e) => handleInputChange('additionalEntities', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default CaseRequestForm;
