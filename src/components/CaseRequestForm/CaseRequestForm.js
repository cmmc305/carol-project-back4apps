// src/components/CaseRequestForm/CaseRequestForm.js

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Parse from '../../config/parseConfig';
import { Container, Form, Button, Row, Col, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import styles from './CaseRequestForm.module.css';
import CurrencyInput from 'react-currency-input-field';

const CaseRequestForm = () => {
  const { id } = useParams();

  // =====================================
  // SEPARAÇÃO DE ESTADOS PARA ARQUIVOS
  // =====================================
  // 1) Arquivos ANTIGOS (já salvos no Parse) => exibição ( { name, url } ):
  const [savedUccFiles, setSavedUccFiles] = useState([]);
  const [savedTransactionProofFiles, setSavedTransactionProofFiles] = useState([]);

  // 2) Arquivos NOVOS (input type="file") => upload:
  const [newUccFiles, setNewUccFiles] = useState([]);
  const [newTransactionProofFiles, setNewTransactionProofFiles] = useState([]);

  // EIN / SSN
  const [einList, setEinList] = useState(['']);
  const [ssnList, setSsnList] = useState(['']);

  // Dados do formulário
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

  // Estados de UI
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Refs para inputs de arquivo para limpeza
  const uccFileInputRef = useRef(null);
  const transactionProofFileInputRef = useRef(null);



  // ===========================================================================
  // useEffect - Busca o registro do Parse ao editar (id existente)
  // ===========================================================================
  useEffect(() => {
    if (!id) return; // Se não tem id, é criação de novo, não carrega nada
  
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const query = new Parse.Query('CaseRequest');
        const caseRequest = await query.get(id);
  
        // Preenche campos de texto
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
  
        // Preenche listas EIN / SSN
        setEinList(caseRequest.get('einList') || ['']);
        setSsnList(caseRequest.get('ssnList') || ['']);
  
        // Converte arquivos salvos para exibição
        setSavedUccFiles(
          (caseRequest.get('uccFiles') || []).map((file) => ({
            name: file.name,
            url: file.url,
          }))
        );
  
        setSavedTransactionProofFiles(
          (caseRequest.get('transactionProofFiles') || []).map((file) => ({
            name: file.name,
            url: file.url,
          }))
        );
  
        // Limpa quaisquer arquivos novos pendentes de upload
        setNewUccFiles([]);
        setNewTransactionProofFiles([]);
      } catch (error) {
        console.error('Error fetching Case Request:', error);
        setError('Failed to fetch Case Request.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchRequest();
  }, [id]);
  

  // ===========================================================================
  // Helpers de formulário
  // ===========================================================================
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddToList = (listSetter, currentList) => {
    listSetter([...currentList, '']);
  };

  const handleRemoveFromList = (listSetter, currentList, index) => {
    const newList = [...currentList];
    newList.splice(index, 1);
    listSetter(newList);
  };

  // ===========================================================================
  // Validação de arquivos
  // ===========================================================================
  const validateFiles = (files) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (let file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError(`Tipo de arquivo não permitido: ${file.name}`);
        return false;
      }
      if (file.size > maxSize) {
        setError(`Arquivo muito grande (máx 5MB): ${file.name}`);
        return false;
      }
    }
    return true;
  };

  // ===========================================================================
  // handleSubmit - Salvar / editar
  // ===========================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    // Validação dos arquivos
    if (
      (newUccFiles.length > 0 && !validateFiles(newUccFiles)) ||
      (newTransactionProofFiles.length > 0 && !validateFiles(newTransactionProofFiles))
    ) {
      setLoading(false);
      return;
    }

    try {
      const CaseRequest = id
        ? await new Parse.Query('CaseRequest').get(id)
        : new Parse.Object('CaseRequest');

      // Salvar campos de texto
      Object.keys(formData).forEach((key) => {
        CaseRequest.set(key, formData[key]);
      });
      CaseRequest.set('lienBalance', parseFloat(formData.lienBalance));
      CaseRequest.set('einList', einList);
      CaseRequest.set('ssnList', ssnList);

      // Carregar do Parse arrays antigos (se houver)
      const oldUccParseFiles = CaseRequest.get('uccFiles') || [];
      const oldTransactionParseFiles = CaseRequest.get('transactionProofFiles') || [];

      // LOG para visualizar os arquivos antigos no banco
      console.log('oldUccParseFiles =>', oldUccParseFiles);
      console.log('oldTransactionProofFiles =>', oldTransactionParseFiles);

      // Converter novos arquivos (File) em Parse.File com progresso
      const convertToParseFiles = async (files) => {
        return await Promise.all(
          files.map(async (file) => {
            const parseFile = new Parse.File(file.name, file);
            await parseFile.save(null, {
              progress: (progress) => {
                setUploadProgress((prev) =>
                  Math.max(prev, Math.round(progress * 100))
                );
              },
            });
            return {
              __type: 'File',
              name: parseFile.name(),
              url: parseFile.url(),
            };
          })
        );
      };

      const newUccParseFilesUploaded = newUccFiles.length > 0 ? await convertToParseFiles(newUccFiles) : [];
      const newTransactionParseFilesUploaded =
        newTransactionProofFiles.length > 0 ? await convertToParseFiles(newTransactionProofFiles) : [];

      // Combinar arquivos antigos e novos
      const allUccFiles = [...oldUccParseFiles, ...newUccParseFilesUploaded];
      const allTransactionProofFiles = [...oldTransactionParseFiles, ...newTransactionParseFilesUploaded];

      // Atualizar no Parse
      CaseRequest.set('uccFiles', allUccFiles);
      CaseRequest.set('transactionProofFiles', allTransactionProofFiles);

      await CaseRequest.save();
      setSuccess('Case Request saved successfully!');
      if (!id) {
        resetForm();
      }

      // Atualizar as listas de arquivos salvos com os novos arquivos
      const updatedCaseRequest = await new Parse.Query('CaseRequest').get(CaseRequest.id);
      const updatedUccParseFiles = updatedCaseRequest.get('uccFiles') || [];
      const updatedTransactionParseFiles = updatedCaseRequest.get('transactionProofFiles') || [];

      console.log('Updated uccParseFiles:', updatedUccParseFiles);
      console.log('Updated transactionParseFiles:', updatedTransactionParseFiles);

      const convertedUpdatedUccFiles = updatedUccParseFiles.map((parseFile) => ({
        name: parseFile.name || parseFile.get('name'), // Correção: acessar como propriedade
        url: parseFile.url || parseFile.get('url'),   // Correção: acessar como propriedade
      }));
      const convertedUpdatedTransactionProofFiles = updatedTransactionParseFiles.map((parseFile) => ({
        name: parseFile.name || parseFile.get('name'), // Correção: acessar como propriedade
        url: parseFile.url || parseFile.get('url'),   // Correção: acessar como propriedade
      }));

      console.log('convertedUccFiles after update =>', convertedUpdatedUccFiles);
      console.log('convertedTransactionProofFiles after update =>', convertedUpdatedTransactionProofFiles);

      setSavedUccFiles(convertedUpdatedUccFiles);
      setSavedTransactionProofFiles(convertedUpdatedTransactionProofFiles);

      // Limpar os novos arquivos após o salvamento
      setNewUccFiles([]);
      setNewTransactionProofFiles([]);

      // Limpar os inputs de arquivo
      if (uccFileInputRef.current) {
        uccFileInputRef.current.value = '';
      }
      if (transactionProofFileInputRef.current) {
        transactionProofFileInputRef.current.value = '';
      }

      // Se for novo registro, limpa tudo
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
        setEinList(['']);
        setSsnList(['']);
        setSavedUccFiles([]);
        setSavedTransactionProofFiles([]);
      }
    } catch (error) {
      console.error('Error saving Case Request:', error);
      setError('Failed to save Case Request. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // ===========================================================================
  // handleDeleteFile - Remove file from saved lists
  // ===========================================================================
  const handleDeleteFile = async (fileType, file) => {
    try {
      if (fileType === 'uccFiles') {
        setSavedUccFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
      } else if (fileType === 'transactionProofFiles') {
        setSavedTransactionProofFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
      }
  
      // Opcional: Remover do Parse
      if (id) {
        const query = new Parse.Query('CaseRequest');
        const caseRequest = await query.get(id);
  
        const updatedFiles =
          fileType === 'uccFiles'
            ? savedUccFiles.filter((f) => f.name !== file.name)
            : savedTransactionProofFiles.filter((f) => f.name !== file.name);
  
        caseRequest.set(fileType, updatedFiles.map((f) => ({ __type: 'File', name: f.name, url: f.url })));
        await caseRequest.save();
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setError('Failed to delete file. Please try again.');
    }
  };

  // ===========================================================================
  // resetForm - Reset form data
  // ===========================================================================
  const resetForm = () => {
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
    setSavedUccFiles([]);
    setSavedTransactionProofFiles([]);
    setNewUccFiles([]);
    setNewTransactionProofFiles([]);

    // Clear file inputs
    if (uccFileInputRef.current) {
      uccFileInputRef.current.value = '';
    }
    if (transactionProofFileInputRef.current) {
      transactionProofFileInputRef.current.value = '';
    }
  };

  return (
    <Container className={styles.caseRequestContainer}>
      <h1 className={`text-center ${styles.title}`}>Case Request Form</h1>
      <Form className={styles.form} onSubmit={handleSubmit}>
        {/* Exibição de alertas de erro ou sucesso */}
        {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}
        {success && <Alert variant="success" className={styles.alert}>{success}</Alert>}

        {/* Indicador de progresso */}
        {loading && (
          <div className="mb-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            {uploadProgress > 0 && <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mt-2" />}
          </div>
        )}

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
                  disabled={einList.length === 1}
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
                  disabled={ssnList.length === 1}
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

        {/* Exibir arquivos UCC Notices */}
        <Row>
          <Col md={12}>
            <Form.Label>Uploaded UCC Notices</Form.Label>
            {savedUccFiles.length > 0 ? (
              <ul>
                {savedUccFiles.map((file, index) => (
                  <li key={index} className="d-flex align-items-center">
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.name}
                    </a>
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleDeleteFile('uccFiles', file)}
                    >
                      🗑️
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No files uploaded.</p>
            )}
          </Col>
        </Row>

        {/* Exibir arquivos Proof of Transaction */}
        <Row>
          <Col md={12}>
            <Form.Label>Uploaded Proof of Transaction</Form.Label>
            {savedTransactionProofFiles.length > 0 ? (
              <ul>
                {savedTransactionProofFiles.map((file, index) => (
                  <li key={index} className="d-flex align-items-center">
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.name}
                    </a>
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleDeleteFile('transactionProofFiles', file)}
                    >
                      🗑️
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No files uploaded.</p>
            )}
          </Col>
        </Row>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </Form>
    </Container>
  );
};

export default CaseRequestForm;
