// src/components/DocumentAnalysis/DocumentAnalysis.js

import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import styles from './DocumentAnalysis.module.css';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const DocumentAnalysis = () => {
  // Estados para PDF e análise
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  // Estado para os padrões (patterns) vindos da planilha
  const [patternsData, setPatternsData] = useState(null);

  // Busca os padrões do Google Sheets assim que o componente for montado.
  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        // Suponha que você tenha publicado a planilha como JSON ou converta para JSON por um endpoint
        // Exemplo: (ajuste a URL conforme sua publicação)
        const response = await fetch('https://api.example.com/patterns'); 
        const data = await response.json();
        setPatternsData(data);
      } catch (err) {
        console.error("Erro ao buscar padrões:", err);
        setError("Erro ao buscar os dados dos padrões.");
      }
    };
    fetchPatterns();
  }, []);

  // Constrói o prompt customizado com base nos padrões vindos da planilha.
  const buildPrompt = () => {
    if (!patternsData) {
      return "";
    }
    // Suponha que patternsData seja um objeto onde cada chave é o nome do padrão
    // e o valor é um array de termos, por exemplo:
    // { "American Express": ["AMEX EPAYMENT", "Amex", "2005032111"], ... }
    let tableText = "";
    for (const key in patternsData) {
      tableText += `${key}: ${patternsData[key].join(", ")}\n`;
    }
    return `Analyze the following text extracted from a PDF of banking transactions and identify any relevant financial patterns based on the table below:

Table of Patterns:
${tableText}

Return the results in JSON format with the following structure:
{
  "pages": [
    { "page": <page number>, "patterns": [<list of patterns found>] },
    ...
  ]
}
If no relevant pattern is found, return: { "pages": [] }.

Provide the answer in Portuguese.`;
  };

  // Estado para o prompt customizado; atualiza sempre que os padrões são carregados.
  const [customPrompt, setCustomPrompt] = useState("");
  useEffect(() => {
    const prompt = buildPrompt();
    setCustomPrompt(prompt);
  }, [patternsData]);

  // Função que chama a API do ChatGPT para analisar o texto do PDF
  const analyzePdfTextWithGPT = async (text, prompt) => {
    try {
      const response = await fetch('/api/analyze-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, customPrompt: prompt })
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

  // Função para upload e extração de texto do PDF usando pdfjs
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

  // Função para analisar o PDF (dividir em páginas e chamar a API para cada página)
  const handleAnalyze = async () => {
    if (!pdfText) {
      setError("Nenhum texto de PDF disponível. Faça o upload de um PDF primeiro.");
      return;
    }
    if (!customPrompt) {
      setError("Nenhum prompt customizado disponível. Verifique os dados dos padrões.");
      return;
    }
    setLoading(true);
    setAnalysisResult("");
    const pages = pdfText.split('\f').filter(p => p.trim().length > 0);
    const totalPages = pages.length;
    let results = [];
    for (let i = 0; i < totalPages; i++) {
      const pageText = pages[i];
      const pageResult = await analyzePdfTextWithGPT(pageText, customPrompt);
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
      <h1 className={styles.title}>Document Analysis</h1>
      
      <Form.Group controlId="customPrompt" className="mb-3">
        <Form.Label className={styles.label}>Custom Prompt (opcional)</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className={styles.input}
        />
      </Form.Group>
      
      <Form.Group controlId="pdfFile" className="mb-3">
        <Form.Label className={styles.label}>Upload PDF de Transações Bancárias</Form.Label>
        <Form.Control
          type="file"
          accept="application/pdf"
          onChange={handlePdfUpload}
          className={styles.input}
        />
      </Form.Group>
      
      <Button variant="primary" onClick={handleAnalyze} disabled={loading || !pdfText}>
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
          <Form.Control
            as="textarea"
            rows={10}
            value={analysisResult}
            readOnly
            className={styles.input}
          />
        </Form.Group>
      )}
    </Container>
  );
};

export default DocumentAnalysis;
