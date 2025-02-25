import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, ProgressBar, ListGroup } from 'react-bootstrap';
import styles from './DocumentAnalysis.module.css';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const DocumentAnalysis = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [patterns, setPatterns] = useState([]);

  // 🚀 1. Busca os padrões diretamente da planilha do Google Sheets
  useEffect(() => {
    fetch('https://opensheet.elk.sh/1wpnDIkr7A_RpM8sulHh2OcifbJD7zXol19dlmeJDmug/Codes')
      .then(response => response.json())
      .then(data => {
        setPatterns(data.map(item => item.Codes.split(', ')).flat()); // Pegamos todos os padrões e formatamos corretamente
      })
      .catch(err => console.error("Erro ao buscar padrões:", err));
  }, []);

  // 🚀 2. Função para extrair o texto do PDF
  const handlePdfUpload = (e) => {
    setError("");
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      const fileReader = new FileReader();
      fileReader.onload = async function() {
        try {
          const typedArray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let fullText = "";
          const totalPages = pdf.numPages;
          for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(" ");
            fullText += "\f" + pageText;
            const progress = Math.round((pageNum / totalPages) * 100);
            setUploadProgress(progress);
          }
          setPdfText(fullText);
        } catch (err) {
          console.error("Erro na extração do PDF:", err);
          setError("Falha ao extrair o texto do PDF.");
        }
      };
      fileReader.onerror = () => {
        setError("Falha ao ler o arquivo PDF.");
      };
      fileReader.readAsArrayBuffer(file);
    } else {
      setError("Por favor, faça o upload de um arquivo PDF válido.");
    }
  };

  // 🚀 3. Função para verificar padrões encontrados
  const findPatternsInText = (text) => {
    let foundPatterns = [];
    patterns.forEach(pattern => {
      if (text.includes(pattern)) {
        foundPatterns.push(pattern);
      }
    });
    return foundPatterns;
  };

  // 🚀 4. Função para analisar o PDF e cruzar os dados
  const handleAnalyze = async () => {
    if (!pdfText) {
      setError("Nenhum texto de PDF disponível. Faça o upload de um PDF primeiro.");
      return;
    }
    setLoading(true);
    setAnalysisResult("");

    let pages = pdfText.split('\f').filter(p => p.trim().length > 0);
    let results = [];

    for (let i = 0; i < pages.length; i++) {
      const pageText = pages[i];
      const matchedPatterns = findPatternsInText(pageText);
      
      if (matchedPatterns.length > 0) {
        results.push({ page: i + 1, patterns: matchedPatterns });
      }
      
      const progress = Math.round(((i + 1) / pages.length) * 100);
      setUploadProgress(progress);
    }

    const combinedAnalysis = JSON.stringify({ pages: results }, null, 2);
    setAnalysisResult(combinedAnalysis);
    setLoading(false);
  };

  return (
    <Container className={styles.documentAnalysisContainer}>
      <h1 className={styles.title}>Análise de Documentos</h1>

      {/* 📌 Exibir a lista de padrões buscados */}
      <h4 className="mt-3">Padrões Buscados:</h4>
      <ListGroup>
        {patterns.length > 0 ? (
          patterns.map((pattern, index) => (
            <ListGroup.Item key={index}>{pattern}</ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>Carregando padrões...</ListGroup.Item>
        )}
      </ListGroup>

      {/* 📌 Campo para upload do PDF */}
      <Form.Group controlId="pdfFile" className="mt-3">
        <Form.Label className={styles.label}>Upload PDF de Transações Bancárias</Form.Label>
        <Form.Control
          type="file"
          accept="application/pdf"
          onChange={handlePdfUpload}
          className={styles.input}
        />
      </Form.Group>

      <Button variant="primary" className="mt-3" onClick={handleAnalyze} disabled={loading || !pdfText}>
        {loading ? 'Analisando...' : 'Analisar PDF'}
      </Button>

      {loading && (
        <div className="mb-3">
          <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mt-2" />
        </div>
      )}

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {analysisResult && (
        <Form.Group controlId="analysisResult" className="mt-3">
          <Form.Label className={styles.label}>Resultado da Análise</Form.Label>
          <Form.Control as="textarea" rows={10} value={analysisResult} readOnly className={styles.input} />
        </Form.Group>
      )}
    </Container>
  );
};

export default DocumentAnalysis;
