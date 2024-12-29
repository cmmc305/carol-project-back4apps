// src/components/CaseRequestForm/CaseRequestForm.js

// src/components/CaseRequestForm/CaseRequestForm.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Parse from '../../config/parseConfig';
import { Container, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import styles from './CaseRequestForm.module.css';

const CaseRequestForm = () => {
  const { id } = useParams(); // Captura o ID da URL
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Carregar dados do registro existente, se o ID for fornecido
  useEffect(() => {
    if (id) {
      const fetchRequest = async () => {
        setLoading(true);
        try {
          const query = new Parse.Query('CaseRequest');
          const caseRequest = await query.get(id);

          // Preenche os campos com os dados existentes
          setFormData({
            requesterEmail: caseRequest.get('requesterEmail') || '',
            creditorName: caseRequest.get('creditorName') || '',
            businessName: caseRequest.get('businessName') || '',
            doingBusinessAs: caseRequest.get('doingBusinessAs') || '',
            requestType: caseRequest.get('requestType') || '',
            lienBalance: caseRequest.get('lienBalance') || '',
            additionalEntities: caseRequest.get('additionalEntities') || '',
            defaultDate: caseRequest.get('defaultDate') || '',
            address: caseRequest.get('address') || '',
            state: caseRequest.get('state') || '',
            city: caseRequest.get('city') || '',
            zipcode: caseRequest.get('zipcode') || '',
            emailAddress: caseRequest.get('emailAddress') || '',
            phoneNumber: caseRequest.get('phoneNumber') || '',
          });

          setUccFiles(caseRequest.get('uccFiles') || []);
          setTransactionProofFiles(caseRequest.get('transactionProofFiles') || []);
          setEinList(caseRequest.get('einList') || ['']);
          setSsnList(caseRequest.get('ssnList') || ['']);
        } catch (error) {
          console.error('Error fetching Case Request:', error);
          setError('Failed to fetch the Case Request.');
        } finally {
          setLoading(false);
        }
      };

      fetchRequest();
    }
  }, [id]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const CaseRequest = id
        ? await new Parse.Query('CaseRequest').get(id)
        : new Parse.Object('CaseRequest');

      Object.keys(formData).forEach((key) => {
        CaseRequest.set(key, formData[key]);
      });

      CaseRequest.set('lienBalance', parseFloat(formData.lienBalance));
      CaseRequest.set(
        'uccFiles',
        uccFiles.map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
        }))
      );
      CaseRequest.set(
        'transactionProofFiles',
        transactionProofFiles.map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
        }))
      );
      CaseRequest.set('einList', einList);
      CaseRequest.set('ssnList', ssnList);

      await CaseRequest.save();
      setSuccess('Case Request saved successfully!');
      if (!id) {
        // Reseta os campos apenas se for uma nova solicitação
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
        setUccFiles([]);
        setTransactionProofFiles([]);
        setEinList(['']);
        setSsnList(['']);
      }
    } catch (error) {
      console.error('Error saving Case Request:', error);
      setError('Failed to save Case Request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handlers para upload de arquivos e adição/remoção de EIN e SSN podem ser adicionados aqui

  return (
    <Container className={styles.caseRequestContainer}>
      <h1 className={`text-center ${styles.title}`}>Case Request Form</h1>
      <Form className={styles.form} onSubmit={handleSubmit}>
        {/* Exibição de alertas de erro ou sucesso */}
        {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}
        {success && <Alert variant="success" className={styles.alert}>{success}</Alert>}

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="requesterEmail">
              <Form.Label>Requester Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter requester email"
                value={formData.requesterEmail}
                onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
                className={styles.input}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="requestType">
              <Form.Label>Request Type</Form.Label>
              <Form.Select
                value={formData.requestType}
                onChange={(e) => handleInputChange('requestType', e.target.value)}
                className={styles.input}
                required
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
            <Form.Group className="mb-3" controlId="businessName">
              <Form.Label>Business Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter business name"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className={styles.input}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="doingBusinessAs">
              <Form.Label>Doing Business As</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter doing business as"
                value={formData.doingBusinessAs}
                onChange={(e) => handleInputChange('doingBusinessAs', e.target.value)}
                className={styles.input}
              />
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
                className={styles.input}
                required
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
                className={styles.input}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={styles.input}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="zipcode">
              <Form.Label>Zipcode</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter zipcode"
                value={formData.zipcode}
                onChange={(e) => handleInputChange('zipcode', e.target.value)}
                className={styles.input}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="emailAddress">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email address"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                className={styles.input}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={styles.input}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="lienBalance">
              <Form.Label>Lien Balance</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter lien balance"
                value={formData.lienBalance}
                onChange={(e) => handleInputChange('lienBalance', e.target.value)}
                className={styles.input}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="defaultDate">
              <Form.Label>Default Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter default date"
                value={formData.defaultDate}
                onChange={(e) => handleInputChange('defaultDate', e.target.value)}
                className={styles.input}
              />
            </Form.Group>
          </Col>
        </Row>

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
                className={styles.textarea}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="uccFiles" className="mb-3">
              <Form.Label>UCC Files</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => setUccFiles(Array.from(e.target.files))}
                className={styles.input}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="transactionProofFiles" className="mb-3">
              <Form.Label>Transaction Proof Files</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => setTransactionProofFiles(Array.from(e.target.files))}
                className={styles.input}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button
          type="submit"
          variant="primary"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default CaseRequestForm;
