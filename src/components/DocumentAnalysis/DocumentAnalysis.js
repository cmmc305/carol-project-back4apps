// src/components/DocumentAnalysis/DocumentAnalysis.js

import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import styles from './DocumentAnalysis.module.css';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import Papa from 'papaparse';

// Configure o worker do pdf.js – certifique-se de que o arquivo esteja na pasta public
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const DocumentAnalysis = () => {
  // Estados para o PDF e extração de texto
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  // Estado para os padrões financeiros vindos da planilha
  const [patternsData, setPatternsData] = useState(null);

  // Estado para o prompt customizado
  const [customPrompt, setCustomPrompt] = useState("");

  // ==============================
  // Busca os dados da planilha do Google Sheets
  // ==============================
  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        // URL para exportar a planilha como CSV – ajuste se necessário
        const csvUrl = 'https://docs.google.com/spreadsheets/d/1wpnDIkr7A_RpM8sulHh2OcifbJD7zXol19dlmeJDmug/export?format=csv&id=1wpnDIkr7A_RpM8sulHh2OcifbJD7zXol19dlmeJDmug';
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error("Erro ao buscar CSV da planilha");
        const csvText = await response.text();

        // Parse do CSV usando PapaParse
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            // Aqui esperamos que cada linha contenha colunas como "Name" e "Codes"
            setPatternsData(results.data);
          },
          error: (err) => {
            console.error("Erro no PapaParse:", err);
            setError("Falha ao processar os dados da planilha.");
          }
        });
      } catch (err) {
        console.error("Erro ao buscar padrões da planilha:", err);
        setError("Falha ao buscar os dados dos padrões.");
      }
    };

    fetchPatterns();
  }, []);

  // ==============================
  // Constrói o prompt customizado com base nos dados da planilha
  // ==============================
  useEffect(() => {
    if (!patternsData) return;
    let tableText = "";
    // Supondo que as colunas sejam "Name" e "Codes"
    patternsData.forEach(row => {
      if (row.Name && row.Codes) {
        tableText += `${row.Name}: ${row.Codes}\n`;
      }
    });

    const prompt = `Analise o seguinte texto extraído de um PDF de transações bancárias e identifique os padrões financeiros relevantes, comparando com a tabela abaixo:

Tabela de Padrões:
${tableText}

Retorne o resultado em formato JSON com a seguinte estrutura:
{
  "pages": [
    { "page": <número da página>, "patterns": [<lista de padrões encontrados>] },
    ...
  ]
}
Caso nenhum padrão seja encontrado, retorne: { "pages": [] }.

Forneça a resposta em Português.`;

    setCustomPrompt(prompt);
  }, [patternsData]);

  // ==============================
  // Função para chamar a API do ChatGPT (OpenAI)
  // ==============================
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
    } catch (err) {
      console.error("Erro ao analisar PDF:", err);
      return { error: "Erro na análise do PDF." };
    }
  };

  // ==============================
  // Função para upload e extração do texto do PDF usando pdfjs
  // ==============================
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

  // ==============================
  // Função para analisar o PDF (dividir em páginas e chamar a API para cada página)
  // ==============================
  const handleAnalyze = async () => {
    if (!pdfText) {
      setError("Nenhum texto de PDF disponível. Faça o upload de um PDF primeiro.");
      return;
    }
    if (!customPrompt) {
      setError("Nenhum prompt customizado disponível. Verifique os dados da planilha.");
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
      
      {/* Campo para edição do prompt customizado */}
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
      
      {/* Campo para upload do PDF */}
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
