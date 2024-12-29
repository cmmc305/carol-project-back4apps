// src/components/CaseRequestForm/CaseRequestForm.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Parse from '../../config/parseConfig';
import { Container, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import styles from './CaseRequestForm.module.css';
import CurrencyInput from 'react-currency-input-field';

const CaseRequestForm = () => {
  const { id } = useParams();
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

  useEffect(() => {
    if (id) {
      const fetchRequest = async () => {
        setLoading(true);
        try {
          const query = new Parse.Query('CaseRequest');
          const caseRequest = await query.get(id);

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

          const uccFilesFromParse = caseRequest.get('uccFiles') || [];
          const transactionProofFilesFromParse = caseRequest.get('transactionProofFiles') || [];

          setUccFiles(uccFilesFromParse.map((file) => file));
          setTransactionProofFiles(transactionProofFilesFromParse.map((file) => file));
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

  const handleAddToList = (listSetter, currentList) => {
    listSetter([...currentList, '']);
  };

  const handleRemoveFromList = (listSetter, currentList, index) => {
    const newList = [...currentList];
    newList.splice(index, 1);
    listSetter(newList);
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

      // Salvar dados do formulário
      Object.keys(formData).forEach((key) => {
        CaseRequest.set(key, formData[key]);
      });

      CaseRequest.set('lienBalance', parseFloat(formData.lienBalance));
      CaseRequest.set('einList', einList);
      CaseRequest.set('ssnList', ssnList);

      // Salvar arquivos como Parse.File
      const uccFilesToSave = await Promise.all(
        uccFiles.map((file) => {
          const parseFile = new Parse.File(file.name, file);
          return parseFile.save(); // Salvar no Parse
        })
      );
      const transactionProofFilesToSave = await Promise.all(
        transactionProofFiles.map((file) => {
          const parseFile = new Parse.File(file.name, file);
          return parseFile.save(); // Salvar no Parse
        })
      );

      // Adicionar arquivos ao registro
      CaseRequest.set('uccFiles', uccFilesToSave);
      CaseRequest.set('transactionProofFiles', transactionProofFilesToSave);

      await CaseRequest.save();

      setSuccess('Case Request saved successfully!');
      if (!id) {
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

  return (
    <Container className={styles.caseRequestContainer}>
      <h1 className={`text-center ${styles.title}`}>Case Request Form</h1>
      <Form className={styles.form} onSubmit={handleSubmit}>
        {/* Exibição de alertas de erro ou sucesso */}
        {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}
        {success && <Alert variant="success" className={styles.alert}>{success}</Alert>}

        {/* Campos principais */}
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
            <Form.Group className="mb-3" controlId="creditorName">
              <Form.Label>Creditor Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter creditor name"
                value={formData.creditorName}
                onChange={(e) => handleInputChange('creditorName', e.target.value)}
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
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter zip code"
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
              <CurrencyInput
                id="lienBalance"
                name="lienBalance"
                placeholder="Enter lien balance"
                prefix="$"
                decimalsLimit={2}
                value={formData.lienBalance}
                onValueChange={(value) => handleInputChange('lienBalance', value)}
                className={`${styles.input} form-control`}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="defaultDate">
              <Form.Label>Default Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Select default date"
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

        {/* EIN List */}
        <Row>
          <Col md={12}>
            <Form.Label>EIN</Form.Label>
            {einList.map((ein, index) => (
              <div key={index} className="d-flex mb-2">
                <Form.Control
                  type="text"
                  placeholder="Enter EIN"
                  value={ein}
                  onChange={(e) =>
                    setEinList(einList.map((item, i) => (i === index ? e.target.value : item)))
                  }
                  className={`${styles.input} me-2`}
                />
                <Button
                  variant="danger"
                  onClick={() => handleRemoveFromList(setEinList, einList, index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="primary" onClick={() => handleAddToList(setEinList, einList)}>
              Add EIN
            </Button>
          </Col>
        </Row>

        {/* SSN List */}
        <Row className="mt-3">
          <Col md={12}>
            <Form.Label>SSN</Form.Label>
            {ssnList.map((ssn, index) => (
              <div key={index} className="d-flex mb-2">
                <Form.Control
                  type="text"
                  placeholder="Enter SSN"
                  value={ssn}
                  onChange={(e) =>
                    setSsnList(ssnList.map((item, i) => (i === index ? e.target.value : item)))
                  }
                  className={`${styles.input} me-2`}
                />
                <Button
                  variant="danger"
                  onClick={() => handleRemoveFromList(setSsnList, ssnList, index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="primary" onClick={() => handleAddToList(setSsnList, ssnList)}>
              Add SSN
            </Button>
          </Col>
        </Row>

        {/* File Uploads */}
        <Row className="mt-3">
          <Col md={6}>
            <Form.Group controlId="uccFiles" className="mb-3">
              <Form.Label>UCC Notices Files</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => setUccFiles(Array.from(e.target.files))}
                className={styles.input}
              />
              {uccFiles.length > 0 && (
                <div className="mt-2">
                  {uccFiles.map((file, index) => (
                    <p key={index} className="mb-0">
                      {file.name || file._name}
                    </p>
                  ))}
                </div>
              )}
            </Form.Group>

          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={6}>
            <Form.Group controlId="transactionProofFiles" className="mb-3">
              <Form.Label>Proof of Transaction</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => setTransactionProofFiles(Array.from(e.target.files))}
                className={styles.input}
              />
              {transactionProofFiles.length > 0 && (
                <div className="mt-2">
                  {transactionProofFiles.map((file, index) => (
                    <p key={index} className="mb-0">
                      {file.name || file._name}
                    </p>
                  ))}
                </div>
              )}
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
    </Container >
  );
};

export default CaseRequestForm;
