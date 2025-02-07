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

// ==========================================================
// Função que chama a API para analisar o texto do PDF usando ChatGPT (ou lógica similar)
// ==========================================================
const analyzePdfTextWithGPT = async (text) => {
  try {
    // Faz uma requisição POST para o endpoint que realiza a análise (ajuste a URL conforme sua API)
    const response = await fetch('/api/analyze-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });
    if (!response.ok) {
      throw new Error('Erro na chamada da API');
    }
    const data = await response.json();
    // Supomos que o endpoint retorne um objeto { analysis: "mensagem" }
    return data.analysis;
  } catch (error) {
    console.error("Erro ao analisar PDF:", error);
    return "Erro na análise do PDF.";
  }
};

const CaseRequestForm = () => {
  const { id } = useParams();

  // =====================================
  // ESTADOS PARA ARQUIVOS (SALVOS E NOVOS)
  // =====================================
  const [savedUccFiles, setSavedUccFiles] = useState([]);
  const [savedAgreementFiles, setSavedAgreementFiles] = useState([]);
  const [savedBankStatementsFiles, setSavedBankStatementsFiles] = useState([]);
  const [savedUploadSummonsAndComplaintFiles, setSavedUploadSummonsAndComplaintFiles] = useState([]);
  const [savedUploadJudgmentFiles, setSavedUploadJudgmentFiles] = useState([]);
  const [savedUccReleaseFiles, setSavedUccReleaseFiles] = useState([]);

  const [newUccFiles, setNewUccFiles] = useState([]);
  const [newAgreementFiles, setNewAgreementFiles] = useState([]);
  const [newBankStatementsFiles, setNewBankStatementsFiles] = useState([]);
  const [newSummonsAndComplaintFiles, setNewSummonsAndComplaintFiles] = useState([]);
  const [newUploadJudgmentFiles, setNewUploadJudgmentFiles] = useState([]);
  const [newUccReleaseFiles, setNewUccReleaseFiles] = useState([]);

  // Novo estado para o PDF de transações bancárias
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfAnalysisResult, setPdfAnalysisResult] = useState("");

  // =========================
  // ESTADO DOS DADOS DO FORMULÁRIO
  // =========================
  const [formData, setFormData] = useState({
    requesterEmail: '',
    creditorName: '',
    merchantName: '',       // Novo Campo
    ein: '',                // Campo único EIN
    ssn: '',                // Campo único SSN
    businessName: '',
    doingBusinessAs: '',
    requestType: '',        // Opções: Lien, Garnishment, Release
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

  // =========================
  // ESTADOS DE UI
  // =========================
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // =========================
  // REFS PARA LIMPAR OS INPUTS DE ARQUIVO
  // =========================
  const uccFileInputRef = useRef(null);
  const agreementFileInputRef = useRef(null);
  const bankStatementsFileInputRef = useRef(null);
  const summonsAndComplaintFileInputRef = useRef(null);
  const uploadJudgmentFileInputRef = useRef(null);
  const uccReleaseFileInputRef = useRef(null);

  // ===================================================
  // Função para upload e análise do PDF de transações bancárias
  // ===================================================
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target.result;
        // Chama a função que utiliza a API do ChatGPT para analisar o texto extraído do PDF
        const analysis = await analyzePdfTextWithGPT(text);
        setPdfAnalysisResult(analysis);
      };
      reader.onerror = () => {
        setError("Falha ao ler o arquivo PDF.");
      };
      reader.readAsText(file);
    } else {
      setError("Por favor, faça o upload de um arquivo PDF válido.");
    }
  };

  // =======================================================================
  // useEffect - Busca o registro do Parse ao editar (id existente)
  // =======================================================================
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

        const uccParseFiles = caseRequest.get('uccFiles') || [];
        const agreementParseFiles = caseRequest.get('agreementFiles') || [];
        const bankStatementsParseFiles = caseRequest.get('bankStatementsFiles') || [];
        const summonsAndComplaintParseFiles = caseRequest.get('uploadSummonsAndComplaintFiles') || [];
        const uploadJudgmentParseFiles = caseRequest.get('uploadJudgmentFiles') || [];
        const uccReleaseParseFiles = caseRequest.get('uccReleaseFiles') || [];

        const convertedUccFiles = uccParseFiles.map((file) => ({
          name: file.name() || file.get('name'),
          url: file.url() || file.get('url'),
        }));
        const convertedAgreementFiles = agreementParseFiles.map((file) => ({
          name: file.name() || file.get('name'),
          url: file.url() || file.get('url'),
        }));
        const convertedBankStatementsFiles = bankStatementsParseFiles.map((file) => ({
          name: file.name() || file.get('name'),
          url: file.url() || file.get('url'),
        }));
        const convertedSummonsAndComplaintFiles = summonsAndComplaintParseFiles.map((file) => ({
          name: file.name() || file.get('name'),
          url: file.url() || file.get('url'),
        }));
        const convertedUploadJudgmentFiles = uploadJudgmentParseFiles.map((file) => ({
          name: file.name() || file.get('name'),
          url: file.url() || file.get('url'),
        }));
        const convertedUccReleaseFiles = uccReleaseParseFiles.map((file) => ({
          name: file.name() || file.get('name'),
          url: file.url() || file.get('url'),
        }));

        setSavedUccFiles(convertedUccFiles);
        setSavedAgreementFiles(convertedAgreementFiles);
        setSavedBankStatementsFiles(convertedBankStatementsFiles);
        setSavedUploadSummonsAndComplaintFiles(convertedSummonsAndComplaintFiles);
        setSavedUploadJudgmentFiles(convertedUploadJudgmentFiles);
        setSavedUccReleaseFiles(convertedUccReleaseFiles);

        setNewUccFiles([]);
        setNewAgreementFiles([]);
        setNewBankStatementsFiles([]);
        setNewSummonsAndComplaintFiles([]);
        setNewUploadJudgmentFiles([]);
        setNewUccReleaseFiles([]);
      } catch (error) {
        console.error('Error fetching Case Request:', error);
        setError('Failed to fetch the Case Request.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  // =======================================================================
  // Helpers de formulário
  // =======================================================================
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // =======================================================================
  // Validação de arquivos
  // =======================================================================
  const validateFiles = (files) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;
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

  // =======================================================================
  // handleSubmit - Salvar / editar
  // =======================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    if (
      (newUccFiles.length > 0 && !validateFiles(newUccFiles)) ||
      (newAgreementFiles.length > 0 && !validateFiles(newAgreementFiles)) ||
      (newBankStatementsFiles.length > 0 && !validateFiles(newBankStatementsFiles)) ||
      (newSummonsAndComplaintFiles.length > 0 && !validateFiles(newSummonsAndComplaintFiles)) ||
      (newUploadJudgmentFiles.length > 0 && !validateFiles(newUploadJudgmentFiles)) ||
      (newUccReleaseFiles.length > 0 && !validateFiles(newUccReleaseFiles))
    ) {
      setLoading(false);
      return;
    }

    try {
      const CaseRequest = id
        ? await new Parse.Query('CaseRequest').get(id)
        : new Parse.Object('CaseRequest');

      Object.keys(formData).forEach((key) => {
        CaseRequest.set(key, formData[key]);
      });
      CaseRequest.set('defaultAmount', parseFloat(formData.defaultAmount) || 0);

      const oldUccParseFiles = CaseRequest.get('uccFiles') || [];
      const oldAgreementParseFiles = CaseRequest.get('agreementFiles') || [];
      const oldBankStatementsParseFiles = CaseRequest.get('bankStatementsFiles') || [];
      const oldSummonsAndComplaintParseFiles = CaseRequest.get('uploadSummonsAndComplaintFiles') || [];
      const oldUploadJudgmentParseFiles = CaseRequest.get('uploadJudgmentFiles') || [];
      const oldUccReleaseParseFiles = CaseRequest.get('uccReleaseFiles') || [];

      const convertToParseFiles = async (files) => {
        return await Promise.all(
          files.map(async (file) => {
            const parseFile = new Parse.File(file.name, file);
            await parseFile.save(null, {
              progress: (progress) => {
                setUploadProgress((prev) => Math.max(prev, Math.round(progress * 100)));
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
      const newAgreementParseFilesUploaded = newAgreementFiles.length > 0 ? await convertToParseFiles(newAgreementFiles) : [];
      const newBankStatementsFilesUploaded = newBankStatementsFiles.length > 0 ? await convertToParseFiles(newBankStatementsFiles) : [];
      const newSummonsAndComplaintFilesUploaded = newSummonsAndComplaintFiles.length > 0 ? await convertToParseFiles(newSummonsAndComplaintFiles) : [];
      const newUploadJudgmentFilesUploaded = newUploadJudgmentFiles.length > 0 ? await convertToParseFiles(newUploadJudgmentFiles) : [];
      const newUccReleaseFilesUploaded = newUccReleaseFiles.length > 0 ? await convertToParseFiles(newUccReleaseFiles) : [];

      const allUccFiles = [...oldUccParseFiles, ...newUccParseFilesUploaded];
      const allAgreementFiles = [...oldAgreementParseFiles, ...newAgreementParseFilesUploaded];
      const allBankStatementsFiles = [...oldBankStatementsParseFiles, ...newBankStatementsFilesUploaded];
      const allSummonsAndComplaintFiles = [...oldSummonsAndComplaintParseFiles, ...newSummonsAndComplaintFilesUploaded];
      const allUploadJudgmentFiles = [...oldUploadJudgmentParseFiles, ...newUploadJudgmentFilesUploaded];
      const allUccReleaseFiles = [...oldUccReleaseParseFiles, ...newUccReleaseFilesUploaded];

      CaseRequest.set('uccFiles', allUccFiles);
      CaseRequest.set('agreementFiles', allAgreementFiles);
      CaseRequest.set('bankStatementsFiles', allBankStatementsFiles);
      CaseRequest.set('uploadSummonsAndComplaintFiles', allSummonsAndComplaintFiles);
      CaseRequest.set('uploadJudgmentFiles', allUploadJudgmentFiles);
      CaseRequest.set('uccReleaseFiles', allUccReleaseFiles);

      await CaseRequest.save();
      setSuccess('Case Request saved successfully!');
      if (!id) resetForm();

      const updatedCaseRequest = await new Parse.Query('CaseRequest').get(CaseRequest.id);
      const updatedUccParseFiles = updatedCaseRequest.get('uccFiles') || [];
      const updatedAgreementFiles = updatedCaseRequest.get('agreementFiles') || [];
      const updatedBankStatementsFiles = updatedCaseRequest.get('bankStatementsFiles') || [];
      const updatedSummonsAndComplaintFiles = updatedCaseRequest.get('uploadSummonsAndComplaintFiles') || [];
      const updatedUploadJudgmentFiles = updatedCaseRequest.get('uploadJudgmentFiles') || [];
      const updatedUccReleaseFiles = updatedCaseRequest.get('uccReleaseFiles') || [];

      const convertedUpdatedUccFiles = updatedUccParseFiles.map((file) => ({
        name: file.name() || file.get('name'),
        url: file.url() || file.get('url'),
      }));
      const convertedUpdatedAgreementFiles = updatedAgreementFiles.map((file) => ({
        name: file.name() || file.get('name'),
        url: file.url() || file.get('url'),
      }));
      const convertedUpdatedBankStatementsFiles = updatedBankStatementsFiles.map((file) => ({
        name: file.name() || file.get('name'),
        url: file.url() || file.get('url'),
      }));
      const convertedUpdatedSummonsAndComplaintFiles = updatedSummonsAndComplaintFiles.map((file) => ({
        name: file.name() || file.get('name'),
        url: file.url() || file.get('url'),
      }));
      const convertedUpdatedUploadJudgmentFiles = updatedUploadJudgmentFiles.map((file) => ({
        name: file.name() || file.get('name'),
        url: file.url() || file.get('url'),
      }));
      const convertedUpdatedUccReleaseFiles = updatedUccReleaseFiles.map((file) => ({
        name: file.name() || file.get('name'),
        url: file.url() || file.get('url'),
      }));

      setSavedUccFiles(convertedUpdatedUccFiles);
      setSavedAgreementFiles(convertedUpdatedAgreementFiles);
      setSavedBankStatementsFiles(convertedUpdatedBankStatementsFiles);
      setSavedUploadSummonsAndComplaintFiles(convertedUpdatedSummonsAndComplaintFiles);
      setSavedUploadJudgmentFiles(convertedUpdatedUploadJudgmentFiles);
      setSavedUccReleaseFiles(convertedUpdatedUccReleaseFiles);

      setNewUccFiles([]);
      setNewAgreementFiles([]);
      setNewBankStatementsFiles([]);
      setNewSummonsAndComplaintFiles([]);
      setNewUploadJudgmentFiles([]);
      setNewUccReleaseFiles([]);

      if (uccFileInputRef.current) uccFileInputRef.current.value = '';
      if (agreementFileInputRef.current) agreementFileInputRef.current.value = '';
      if (bankStatementsFileInputRef.current) bankStatementsFileInputRef.current.value = '';
      if (summonsAndComplaintFileInputRef.current) summonsAndComplaintFileInputRef.current.value = '';
      if (uploadJudgmentFileInputRef.current) uploadJudgmentFileInputRef.current.value = '';
      if (uccReleaseFileInputRef.current) uccReleaseFileInputRef.current.value = '';

      if (!id) resetForm();
    } catch (error) {
      console.error('Error saving Case Request:', error);
      setError('Falha ao salvar o Case Request. Por favor, tente novamente.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // =======================================================================
  // handleDeleteFile - Remove file from saved lists
  // =======================================================================
  const handleDeleteFile = async (fileType, file) => {
    try {
      let updatedFiles = [];
      if (fileType === 'uccFiles') {
        updatedFiles = savedUccFiles.filter((f) => f.name !== file.name);
        setSavedUccFiles(updatedFiles);
      } else if (fileType === 'agreementFiles') {
        updatedFiles = savedAgreementFiles.filter((f) => f.name !== file.name);
        setSavedAgreementFiles(updatedFiles);
      } else if (fileType === 'bankStatementsFiles') {
        updatedFiles = savedBankStatementsFiles.filter((f) => f.name !== file.name);
        setSavedBankStatementsFiles(updatedFiles);
      } else if (fileType === 'uploadSummonsAndComplaintFiles') {
        updatedFiles = savedUploadSummonsAndComplaintFiles.filter((f) => f.name !== file.name);
        setSavedUploadSummonsAndComplaintFiles(updatedFiles);
      } else if (fileType === 'uploadJudgmentFiles') {
        updatedFiles = savedUploadJudgmentFiles.filter((f) => f.name !== file.name);
        setSavedUploadJudgmentFiles(updatedFiles);
      } else if (fileType === 'uccReleaseFiles') {
        updatedFiles = savedUccReleaseFiles.filter((f) => f.name !== file.name);
        setSavedUccReleaseFiles(updatedFiles);
      }
      if (id) {
        const query = new Parse.Query('CaseRequest');
        const caseRequest = await query.get(id);
        caseRequest.set(
          fileType,
          updatedFiles.map((f) => ({
            __type: 'File',
            name: f.name,
            url: f.url,
          }))
        );
        await caseRequest.save();
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setError('Falha ao deletar o arquivo. Por favor, tente novamente.');
    }
  };

  // =======================================================================
  // resetForm - Reset form data
  // =======================================================================
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
    setSavedUccFiles([]);
    setSavedAgreementFiles([]);
    setSavedBankStatementsFiles([]);
    setSavedUploadSummonsAndComplaintFiles([]);
    setSavedUploadJudgmentFiles([]);
    setSavedUccReleaseFiles([]);
    setNewUccFiles([]);
    setNewAgreementFiles([]);
    setNewBankStatementsFiles([]);
    setNewSummonsAndComplaintFiles([]);
    setNewUploadJudgmentFiles([]);
    setNewUccReleaseFiles([]);
    if (uccFileInputRef.current) uccFileInputRef.current.value = '';
    if (agreementFileInputRef.current) agreementFileInputRef.current.value = '';
    if (bankStatementsFileInputRef.current) bankStatementsFileInputRef.current.value = '';
    if (summonsAndComplaintFileInputRef.current) summonsAndComplaintFileInputRef.current.value = '';
    if (uploadJudgmentFileInputRef.current) uploadJudgmentFileInputRef.current.value = '';
    if (uccReleaseFileInputRef.current) uccReleaseFileInputRef.current.value = '';
  };

  // =======================================================================
  // Renderização Condicional dos Campos de Upload com base no Request Type
  // =======================================================================
  const renderUploadSections = () => {
    const { requestType } = formData;
    switch (requestType) {
      case 'Lien':
        return (
          <>
            {/* Upload UCC */}
            <div className={styles.uploadSection}>
              <Form.Group controlId="uccFiles" className="mb-3">
                <Form.Label className={styles.uploadSectionTitle}>Upload UCC</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={(e) => setNewUccFiles([...newUccFiles, ...Array.from(e.target.files)])}
                  className={styles.input}
                  ref={uccFileInputRef}
                />
                {newUccFiles.length > 0 && (
                  <div className={styles.newFileList}>
                    <strong>New UCC Files:</strong>
                    <ul className={styles.fileList}>
                      {newUccFiles.map((file, index) => (
                        <li key={index} className={styles.fileItem}>
                          <span className={styles.fileName}>{file.name}</span>
                          <Button
                            variant="danger"
                            size="sm"
                            className={styles.deleteButton}
                            onClick={() => setNewUccFiles(newUccFiles.filter((_, i) => i !== index))}
                          >
                            🗑️
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId="uploadedUccFiles" className="mb-3">
                <Form.Label className={styles.uploadSectionTitle}>Uploaded UCC</Form.Label>
                {savedUccFiles.length > 0 ? (
                  <ul className={styles.fileList}>
                    {savedUccFiles.map((file, index) => (
                      <li key={index} className={styles.fileItem}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className={styles.fileName}>
                          {file.name}
                        </a>
                        <Button
                          variant="danger"
                          size="sm"
                          className={styles.deleteButton}
                          onClick={() => handleDeleteFile('uccFiles', file)}
                        >
                          🗑️
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.noFilesText}>No UCC uploaded.</p>
                )}
              </Form.Group>
            </div>
            {/* Upload Bank Statements */}
            <div className={styles.uploadSection}>
              <Form.Group controlId="bankStatementsFiles" className="mb-3">
                <Form.Label className={styles.uploadSectionTitle}>Upload Bank Statements</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={(e) => setNewBankStatementsFiles([...newBankStatementsFiles, ...Array.from(e.target.files)])}
                  className={styles.input}
                  ref={bankStatementsFileInputRef}
                />
                {newBankStatementsFiles.length > 0 && (
                  <div className={styles.newFileList}>
                    <strong>New Bank Statements Files:</strong>
                    <ul className={styles.fileList}>
                      {newBankStatementsFiles.map((file, index) => (
                        <li key={index} className={styles.fileItem}>
                          <span className={styles.fileName}>{file.name}</span>
                          <Button
                            variant="danger"
                            size="sm"
                            className={styles.deleteButton}
                            onClick={() => setNewBankStatementsFiles(newBankStatementsFiles.filter((_, i) => i !== index))}
                          >
                            🗑️
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId="uploadedBankStatementsFiles" className="mb-3">
                <Form.Label className={styles.uploadSectionTitle}>Uploaded Bank Statements</Form.Label>
                {savedBankStatementsFiles.length > 0 ? (
                  <ul className={styles.fileList}>
                    {savedBankStatementsFiles.map((file, index) => (
                      <li key={index} className={styles.fileItem}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className={styles.fileName}>
                          {file.name}
                        </a>
                        <Button
                          variant="danger"
                          size="sm"
                          className={styles.deleteButton}
                          onClick={() => handleDeleteFile('bankStatementsFiles', file)}
                        >
                          🗑️
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.noFilesText}>No Bank Statements uploaded.</p>
                )}
              </Form.Group>
            </div>
          </>
        );
      case 'Garnishment':
        return (
          <>
            {/* Upload Summons and Complaint */}
            <div className={styles.uploadSection}>
              <Form.Group controlId="uploadSummonsAndComplaintFiles" className="mb-3">
                <Form.Label className={styles.uploadSectionTitle}>Upload Summons and Complaint</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={(e) => setNewSummonsAndComplaintFiles([...newSummonsAndComplaintFiles, ...Array.from(e.target.files)])}
                  className={styles.input}
                  ref={summonsAndComplaintFileInputRef}
                />
                {newSummonsAndComplaintFiles.length > 0 && (
                  <div className={styles.newFileList}>
                    <strong>New Summons and Complaint Files:</strong>
                    <ul className={styles.fileList}>
                      {newSummonsAndComplaintFiles.map((file, index) => (
                        <li key={index} className={styles.fileItem}>
                          <span className={styles.fileName}>{file.name}</span>
                          <Button
                            variant="danger"
                            size="sm"
                            className={styles.deleteButton}
                            onClick={() => setNewSummonsAndComplaintFiles(newSummonsAndComplaintFiles.filter((_, i) => i !== index))}
                          >
                            🗑️
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId="uploadedSummonsAndComplaintFiles" className="mb-3">
                <Form.Label className={styles.uploadSectionTitle}>Uploaded Summons and Complaint</Form.Label>
                {savedUploadSummonsAndComplaintFiles.length > 0 ? (
                  <ul className={styles.fileList}>
                    {savedUploadSummonsAndComplaintFiles.map((file, index) => (
                      <li key={index} className={styles.fileItem}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className={styles.fileName}>
                          {file.name}
                        </a>
                        <Button
                          variant="danger"
                          size="sm"
                          className={styles.deleteButton}
                          onClick={() => handleDeleteFile('uploadSummonsAndComplaintFiles', file)}
                        >
                          🗑️
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.noFilesText}>No Summons and Complaint uploaded.</p>
                )}
              </Form.Group>
            </div>
            {/* Upload Judgment */}
            <div className={styles.uploadSection}>
              <Form.Group controlId="uploadJudgmentFiles" className="mb-3">
                <Form.Label className={styles.uploadSectionTitle}>Upload Judgment</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={(e) => setNewUploadJudgmentFiles([...newUploadJudgmentFiles, ...Array.from(e.target.files)])}
                  className={styles.input}
                  ref={uploadJudgmentFileInputRef}
                />
                {newUploadJudgmentFiles.length > 0 && (
                  <div className={styles.newFileList}>
                    <strong>New Judgment Files:</strong>
                    <ul className={styles.fileList}>
                      {newUploadJudgmentFiles.map((file, index) => (
                        <li key={index} className={styles.fileItem}>
                          <span className={styles.fileName}>{file.name}</span>
                          <Button
                            variant="danger"
                            size="sm"
                            className={styles.deleteButton}
                            onClick={() => setNewUploadJudgmentFiles(newUploadJudgmentFiles.filter((_, i) => i !== index))}
                          >
                            🗑️
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId="uploadedJudgmentFiles" className="mb-3">
                <Form.Label className={styles.uploadSectionTitle}>Uploaded Judgment</Form.Label>
                {savedUploadJudgmentFiles.length > 0 ? (
                  <ul className={styles.fileList}>
                    {savedUploadJudgmentFiles.map((file, index) => (
                      <li key={index} className={styles.fileItem}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className={styles.fileName}>
                          {file.name}
                        </a>
                        <Button
                          variant="danger"
                          size="sm"
                          className={styles.deleteButton}
                          onClick={() => handleDeleteFile('uploadJudgmentFiles', file)}
                        >
                          🗑️
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.noFilesText}>No Judgments uploaded.</p>
                )}
              </Form.Group>
            </div>
          </>
        );
      case 'Release':
        return (
          <>
            {/* Upload UCC Release */}
            <div className={styles.uploadSection}>
              <Form.Group controlId="uccReleaseFiles" className="mb-3">
                <Form.Label className={styles.uploadSectionTitle}>Upload UCC Release</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={(e) => setNewUccReleaseFiles([...newUccReleaseFiles, ...Array.from(e.target.files)])}
                  className={styles.input}
                  ref={uccReleaseFileInputRef}
                />
                {newUccReleaseFiles.length > 0 && (
                  <div className={styles.newFileList}>
                    <strong>New UCC Release Files:</strong>
                    <ul className={styles.fileList}>
                      {newUccReleaseFiles.map((file, index) => (
                        <li key={index} className={styles.fileItem}>
                          <span className={styles.fileName}>{file.name}</span>
                          <Button
                            variant="danger"
                            size="sm"
                            className={styles.deleteButton}
                            onClick={() => setNewUccReleaseFiles(newUccReleaseFiles.filter((_, i) => i !== index))}
                          >
                            🗑️
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId="uploadedUccReleaseFiles" className="mb-3">
                <Form.Label className={styles.uploadSectionTitle}>Uploaded UCC Release</Form.Label>
                {savedUccReleaseFiles.length > 0 ? (
                  <ul className={styles.fileList}>
                    {savedUccReleaseFiles.map((file, index) => (
                      <li key={index} className={styles.fileItem}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className={styles.fileName}>
                          {file.name}
                        </a>
                        <Button
                          variant="danger"
                          size="sm"
                          className={styles.deleteButton}
                          onClick={() => handleDeleteFile('uccReleaseFiles', file)}
                        >
                          🗑️
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.noFilesText}>No UCC Release uploaded.</p>
                )}
              </Form.Group>
            </div>
          </>
        );
      default:
        return null;
    }
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
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            {uploadProgress > 0 && (
              <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mt-2" />
            )}
          </div>
        )}

        {/* Novo campo para upload do PDF de transações bancárias */}
        <Form.Group controlId="pdfFile" className="mb-3">
          <Form.Label className={styles.uploadSectionTitle}>
            Upload PDF de Transações Bancárias
          </Form.Label>
          <Form.Control
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            className={styles.input}
          />
        </Form.Group>
        {pdfAnalysisResult && (
          <Alert variant="info" className={styles.alert}>
            {pdfAnalysisResult}
          </Alert>
        )}

        {/* Campos principais do formulário */}
        <Row>
          <Col md={6}>
            <Form.Group controlId="requesterEmail" className="mb-3">
              <Form.Label>Requester Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter requester email"
                value={formData.requesterEmail}
                onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
                className={styles.input}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="requestType" className="mb-3">
              <Form.Label>Request Type</Form.Label>
              <Form.Select
                value={formData.requestType}
                onChange={(e) => handleInputChange('requestType', e.target.value)}
                className={styles.input}
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
            <Form.Group controlId="businessName" className="mb-3">
              <Form.Label>Business Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter business name"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className={styles.input}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="creditorName" className="mb-3">
              <Form.Label>Creditor Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter creditor name"
                value={formData.creditorName}
                onChange={(e) => handleInputChange('creditorName', e.target.value)}
                className={styles.input}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="merchantName" className="mb-3">
              <Form.Label>Merchant's Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter merchant's name"
                value={formData.merchantName}
                onChange={(e) => handleInputChange('merchantName', e.target.value)}
                className={styles.input}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="ein" className="mb-3">
              <Form.Label>EIN</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter EIN"
                value={formData.ein}
                onChange={(e) => handleInputChange('ein', e.target.value)}
                className={styles.input}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="ssn" className="mb-3">
              <Form.Label>SSN</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter SSN"
                value={formData.ssn}
                onChange={(e) => handleInputChange('ssn', e.target.value)}
                className={styles.input}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="address" className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={styles.input}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="city" className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={styles.input}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="state" className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={styles.input}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="zipcode" className="mb-3">
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter zip code"
                value={formData.zipcode}
                onChange={(e) => handleInputChange('zipcode', e.target.value)}
                className={styles.input}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="emailAddress" className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email address"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                className={styles.input}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="phoneNumber" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={styles.input}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="defaultAmount" className="mb-3">
              <Form.Label>Default Amount</Form.Label>
              <CurrencyInput
                id="defaultAmount"
                name="defaultAmount"
                placeholder="Enter default amount"
                prefix="$"
                decimalsLimit={2}
                value={formData.defaultAmount}
                onValueChange={(value) => handleInputChange('defaultAmount', value)}
                className={`${styles.input} form-control`}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="defaultDate" className="mb-3">
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
            <Form.Group controlId="additionalEntities" className="mb-3">
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

        {/* Renderizar as seções de upload já existentes */}
        {renderUploadSections()}

        {/* Upload Agreement (condicional para Request Type diferente de Garnishment) */}
        {formData.requestType !== 'Garnishment' && (
          <div className={styles.uploadSection}>
            <Form.Group controlId="agreementFiles" className="mb-3">
              <Form.Label className={styles.uploadSectionTitle}>Upload Agreement</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => setNewAgreementFiles([...newAgreementFiles, ...Array.from(e.target.files)])}
                className={styles.input}
                ref={agreementFileInputRef}
              />
              {newAgreementFiles.length > 0 && (
                <div className={styles.newFileList}>
                  <strong>New Agreement Files:</strong>
                  <ul className={styles.fileList}>
                    {newAgreementFiles.map((file, index) => (
                      <li key={index} className={styles.fileItem}>
                        <span className={styles.fileName}>{file.name}</span>
                        <Button
                          variant="danger"
                          size="sm"
                          className={styles.deleteButton}
                          onClick={() => setNewAgreementFiles(newAgreementFiles.filter((_, i) => i !== index))}
                        >
                          🗑️
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Form.Group>
            <Form.Group controlId="uploadedAgreementFiles" className="mb-3">
              <Form.Label className={styles.uploadSectionTitle}>Uploaded Agreements</Form.Label>
              {savedAgreementFiles.length > 0 ? (
                <ul className={styles.fileList}>
                  {savedAgreementFiles.map((file, index) => (
                    <li key={index} className={styles.fileItem}>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className={styles.fileName}>
                        {file.name}
                      </a>
                      <Button
                        variant="danger"
                        size="sm"
                        className={styles.deleteButton}
                        onClick={() => handleDeleteFile('agreementFiles', file)}
                      >
                        🗑️
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noFilesText}>No Agreements uploaded.</p>
              )}
            </Form.Group>
          </div>
        )}

        <Button type="submit" variant="primary" disabled={loading} className={styles.submitButton}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </Form>
    </Container>
  );
};

export default CaseRequestForm;
