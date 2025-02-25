// src/components/DocumentAnalysis/DocumentAnalysis.js

import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, ProgressBar, ListGroup } from 'react-bootstrap';
import Papa from 'papaparse'; // Para processar CSV
import styles from './DocumentAnalysis.module.css';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const DocumentAnalysis = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [patterns, setPatterns] = useState([]); // Padrões da planilha
  const [analysisResult, setAnalysisResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  // Carrega os padrões da planilha no Google Sheets
  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7ZJ3hSlp-BLAblw_d0th6xuJzi7FqjJd95Y4EXL7bKPnchzZlaPfJ2hIYXrBCbR4cH8iVgEx5vWJH/pub?output=csv"
        );
        const csvText = await response.text();
        const parsedData = Papa.parse(csvText, { header: true }).data;

        // Extrai os padrões e remove linhas vazias
        const extractedPatterns = parsedData
          .map(row => ({
            name: row["Name"],
            codes: row["Codes"] ? row["Codes"].split(",").map(code => code.trim()) : []
          }))
          .filter(item => item.name && item.codes.length > 0);

        setPatterns(extractedPatterns);
      } catch (error) {
        console.error("Erro ao carregar padrões:", error);
        setError("Erro ao carregar padrões financeiros.");
      }
    };

    fetchPatterns();
  }, []);

  // Função para analisar o PDF
  const analyzePdfTextWithGPT = async (text, patterns) => {
    try {
      const response = await fetch('/api/analyze-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, patterns }) // Envia os padrões junto com o texto
      });

      if (!response.ok) {
        throw new Error('Erro na chamada da API');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao analisar PDF:", error);
      return { error: "Erro na análise do PDF." };
    }
  };

  // Função para ler o PDF
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

  // Função para processar o PDF
  const handleAnalyze = async () => {
    if (!pdfText) {
      setError("Nenhum texto de PDF disponível. Faça o upload de um PDF primeiro.");
      return;
    }
    
    setLoading(true);
    setAnalysisResult("");

    let pages = pdfText.split('\f').filter(p => p.trim().length > 0);
    const totalPages = pages.length;
    let results = [];

    for (let i = 0; i < totalPages; i++) {
      const pageText = pages[i];
      const pageResult = await analyzePdfTextWithGPT(pageText, patterns);
      results.push({ page: i + 1, patterns: pageResult.patterns || [] });
      const progress = Math.round(((i + 1) / totalPages) * 100);
      setUploadProgress(progress);
    }

    const combinedAnalysis = JSON.stringify({ pages: results }, null, 2);
    setAnalysisResult(combinedAnalysis);
    setLoading(false);
  };

  return (
    <Container className={styles.documentAnalysisContainer}>
      <h1 className={styles.title}>Análise de Documento</h1>

      {/* Exibição dos padrões carregados da planilha */}
      <h4 className={styles.subtitle}>Padrões que serão buscados</h4>
      <ListGroup className="mb-3">
        {patterns.length === 0 ? (
          <Alert variant="warning">Carregando padrões...</Alert>
        ) : (
          patterns.map((pattern, index) => (
            <ListGroup.Item key={index}>
              <strong>{pattern.name}</strong>: {pattern.codes.join(", ")}
            </ListGroup.Item>
          ))
        )}
      </ListGroup>

      {/* Upload do PDF */}
      <Form.Group controlId="pdfFile" className="mb-3">
        <Form.Label className={styles.label}>Upload PDF de Transações Bancárias</Form.Label>
        <Form.Control type="file" accept="application/pdf" onChange={handlePdfUpload} className={styles.input} />
      </Form.Group>

      {/* Botão de Análise */}
      <Button variant="primary" onClick={handleAnalyze} disabled={loading || !pdfText || patterns.length === 0}>
        {loading ? 'Analisando...' : 'Analisar PDF'}
      </Button>

      {loading && (
        <div className="mb-3">
          <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mt-2" />
        </div>
      )}

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {/* Resultado da Análise */}
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
