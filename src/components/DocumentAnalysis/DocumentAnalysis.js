// src/components/DocumentAnalysis/DocumentAnalysis.js

import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import styles from './DocumentAnalysis.module.css';

const DocumentAnalysis = () => {
  // Estado para o PDF e seu texto
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  // Estado para o prompt customizado
  const defaultPrompt = `Analyze the following text extracted from a PDF of banking transactions and identify any relevant financial patterns based on the table below:

Table of Patterns:
American Express: AMEX EPAYMENT, Amex, 2005032111
PayPal: VENMO, PAYPAL, 7264681992
Intuit Payment Systems: 9215986202, Intuit, 0000756346
Chase Paymentech: Paymentech, 1020401225
Stripe: Stripe, ST-, Brightwheel, Doordash, Uber, Uber eats
Bill.com: Bill.com, Divvypay, invoice2go
Mollie Payments: ID:OL90691-0001, Mollie Payments
Paya: Company ID: 3383693141
Payliance: Company ID: 1273846756
ACHQ: Company ID: 1464699697 and 1112999721
AMAZON: 1541507947, 3383693141, 1383694141, 2383693141

Return the results in JSON format with the following structure:
{
  "pages": [
    { "page": <page number>, "patterns": [<list of patterns found>] },
    ...
  ]
}
If no relevant pattern is found, return: { "pages": [] }.

Provide the answer in Portuguese.`;

  const [customPrompt, setCustomPrompt] = useState(defaultPrompt);

  // Função para chamar a API do ChatGPT para analisar o texto do PDF
  const analyzePdfTextWithGPT = async (text, prompt) => {
    try {
      const response = await fetch('/api/analyze-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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

  // Função para ler o PDF, extrair texto e dividir em páginas
  const handlePdfUpload = (e) => {
    setError("");
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target.result;
        setPdfText(text);
      };
      reader.onerror = () => {
        setError("Falha ao ler o arquivo PDF.");
      };
      reader.readAsText(file);
    } else {
      setError("Por favor, faça o upload de um arquivo PDF válido.");
    }
  };

  // Função para processar o PDF, dividir em páginas e analisar cada página
  const handleAnalyze = async () => {
    if (!pdfText) {
      setError("Nenhum texto de PDF disponível. Faça o upload de um PDF primeiro.");
      return;
    }
    setLoading(true);
    setAnalysisResult("");
    // Dividindo o texto pelo separador de página (ajuste conforme necessário)
    let pages = pdfText.split('\f').filter(p => p.trim().length > 0);
    const totalPages = pages.length;
    let results = [];
    for (let i = 0; i < totalPages; i++) {
      const pageText = pages[i];
      // Chama a API para cada página
      const pageResult = await analyzePdfTextWithGPT(pageText, customPrompt);
      // Aqui esperamos que a API retorne um objeto com a estrutura { pages: [{ page, patterns: [...] }, ...] }
      // Mas como estamos enviando página a página, vamos assumir que pageResult contém a lista de padrões encontrados para aquela página.
      results.push({ page: i + 1, patterns: pageResult.patterns || [] });
      const progress = Math.round(((i + 1) / totalPages) * 100);
      setUploadProgress(progress);
    }
    // Converte o resultado em JSON formatado
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
