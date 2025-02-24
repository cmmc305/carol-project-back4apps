// src/components/CaseRequestForm/CaseRequestForm.js

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Parse from '../../config/parseConfig';
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  ProgressBar,
} from 'react-bootstrap';
import styles from './CaseRequestForm.module.css';
import CurrencyInput from 'react-currency-input-field';

const CaseRequestForm = () => {
  const { id } = useParams();

  // Estados para arquivos
  const [savedUccFiles, setSavedUccFiles] = useState([]);
  const [savedAgreementFiles, setSavedAgreementFiles] = useState([]);
  const [savedBankStatementsFiles, setSavedBankStatementsFiles] = useState([]);
  const [savedSummonsFiles, setSavedSummonsFiles] = useState([]);
  const [savedJudgmentFiles, setSavedJudgmentFiles] = useState([]);
  const [savedUccReleaseFiles, setSavedUccReleaseFiles] = useState([]);

  const [newUccFiles, setNewUccFiles] = useState([]);
  const [newAgreementFiles, setNewAgreementFiles] = useState([]);
  const [newBankStatementsFiles, setNewBankStatementsFiles] = useState([]);
  const [newSummonsFiles, setNewSummonsFiles] = useState([]);
  const [newJudgmentFiles, setNewJudgmentFiles] = useState([]);
  const [newUccReleaseFiles, setNewUccReleaseFiles] = useState([]);

  // Estado do formulário
  const [formData, setFormData] = useState({
    requesterEmail: '',
    creditorName: '',
    merchantName: '',
    ein: '',
    ssn: '',
    businessName: '',
    doingBusinessAs: '',
    requestType: '',
    defaultAmount: '',
    additionalEntities: '',
    defaultDate: '',
    address: '',
    state: '',
    city: '',
    zipcode: '',
    emailAddress: '',
    phoneNumber: '',
  });

  // Estados de UI
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // useEffect para buscar dados do Parse se um ID for fornecido
  useEffect(() => {
    if (!id) return;
    
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const query = new Parse.Query('CaseRequest');
        const caseRequest = await query.get(id);
        
        setFormData({
          requesterEmail: caseRequest.get('requesterEmail') || '',
          creditorName: caseRequest.get('creditorName') || '',
          merchantName: caseRequest.get('merchantName') || '',
          ein: caseRequest.get('ein') || '',
          ssn: caseRequest.get('ssn') || '',
          businessName: caseRequest.get('businessName') || '',
          doingBusinessAs: caseRequest.get('doingBusinessAs') || '',
          requestType: caseRequest.get('requestType') || '',
          defaultAmount: caseRequest.get('defaultAmount') || '',
          additionalEntities: caseRequest.get('additionalEntities') || '',
          defaultDate: caseRequest.get('defaultDate') || '',
          address: caseRequest.get('address') || '',
          state: caseRequest.get('state') || '',
          city: caseRequest.get('city') || '',
          zipcode: caseRequest.get('zipcode') || '',
          emailAddress: caseRequest.get('emailAddress') || '',
          phoneNumber: caseRequest.get('phoneNumber') || '',
        });
      } catch (error) {
        console.error('Erro ao buscar o Case Request:', error);
        setError('Falha ao carregar os dados.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequest();
  }, [id]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      const CaseRequest = id
        ? await new Parse.Query('CaseRequest').get(id)
        : new Parse.Object('CaseRequest');

      Object.keys(formData).forEach((key) => {
        CaseRequest.set(key, formData[key]);
      });

      await CaseRequest.save();
      setSuccess('Case Request salvo com sucesso!');
      if (!id) resetForm();
    } catch (error) {
      console.error('Erro ao salvar Case Request:', error);
      setError('Falha ao salvar os dados.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      requesterEmail: '',
      creditorName: '',
      merchantName: '',
      ein: '',
      ssn: '',
      businessName: '',
      doingBusinessAs: '',
      requestType: '',
      defaultAmount: '',
      additionalEntities: '',
      defaultDate: '',
      address: '',
      state: '',
      city: '',
      zipcode: '',
      emailAddress: '',
      phoneNumber: '',
    });
  };

  return (
    <Container className={styles.caseRequestContainer}>
      <h1 className={`${styles.title}`}>Case Request Form</h1>
      <Form className={styles.form} onSubmit={handleSubmit}>
        {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}
        {success && <Alert variant="success" className={styles.alert}>{success}</Alert>}
        {loading && (
          <div className="mb-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
            {uploadProgress > 0 && (
              <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mt-2" />
            )}
          </div>
        )}

        <Row>
          <Col md={6}>
            <Form.Group controlId="requesterEmail" className="mb-3">
              <Form.Label>Email do Solicitante</Form.Label>
              <Form.Control
                type="email"
                value={formData.requesterEmail}
                onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="requestType" className="mb-3">
              <Form.Label>Tipo de Pedido</Form.Label>
              <Form.Select
                value={formData.requestType}
                onChange={(e) => handleInputChange('requestType', e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="Lien">Lien</option>
                <option value="Garnishment">Garnishment</option>
                <option value="Release">Release</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="businessName" className="mb-3">
              <Form.Label>Nome do Negócio</Form.Label>
              <Form.Control
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="defaultAmount" className="mb-3">
              <Form.Label>Valor Padrão</Form.Label>
              <CurrencyInput
                id="defaultAmount"
                name="defaultAmount"
                prefix="$"
                decimalsLimit={2}
                value={formData.defaultAmount}
                onValueChange={(value) => handleInputChange('defaultAmount', value)}
                className="form-control"
              />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="primary" disabled={loading} className={styles.submitButton}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </Form>
    </Container>
  );
};

export default CaseRequestForm;
