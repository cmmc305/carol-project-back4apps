import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import InputMask from 'react-input-mask';
import Parse from '../config/parseConfig';
import { Container, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import reactLogo from '../assets/react-logo.png';

const CaseRequestForm = () => {
  const { id } = useParams();
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
    setter(files);
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
        const query = new Parse.Query('CaseRequest');
        CaseRequest = await query.get(id);
      } else {
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

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <Container className="form-container mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="text-center">
            <img src={reactLogo} alt="React Logo" className="logo mb-4" />
            <h1>{id ? 'Update Request' : 'Create Request'}</h1>
          </div>
          <Form>
            {[
              { id: 'requesterEmail', label: 'Requester Email', type: 'email', value: formData.requesterEmail },
              { id: 'creditorName', label: 'Creditor Name', type: 'text', value: formData.creditorName },
              { id: 'businessName', label: 'Business Name', type: 'text', value: formData.businessName },
              { id: 'state', label: 'State', type: 'text', value: formData.state },
            ].map(({ id, label, type, value }) => (
              <Form.Group controlId={id} className="mb-3" key={id}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type={type}
                  value={value}
                  onChange={(e) => handleInputChange(id, e.target.value)}
                />
              </Form.Group>
            ))}
            <Form.Group controlId="uccFiles" className="mb-3">
              <Form.Label>UCC Files</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e, setUccFiles)}
              />
              <ul>
                {uccFiles.map((file, index) => (
                  <li key={index}>{file.name || file.split('/').pop()}</li>
                ))}
              </ul>
            </Form.Group>
            <Button variant="primary" onClick={handleSubmit}>
              {id ? 'Save Changes' : 'Create Request'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CaseRequestForm;
