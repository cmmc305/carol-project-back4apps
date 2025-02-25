import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, ProgressBar, Table } from 'react-bootstrap';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const DocumentAnalysis = () => {
  const [pdfText, setPdfText] = useState("");
  const [patterns, setPatterns] = useState([]);
  const [analysisResult, setAnalysisResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [customPrompt, setCustomPrompt] = useState("Digite seu prompt personalizado aqui...");

  // ✅ Busca os padrões da planilha do Google Sheets
  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const response = await fetch('https://opensheet.elk.sh/1wpnDIkr7A_RpM8sulHh2OcifbJD7zXol19dlmeJDmug/1');
        if (!response.ok) throw new Error("Erro ao carregar padrões da planilha.");
        
        const data = await response.json();
        console.log("📊 Dados da Planilha:", data);

        // 🔹 Extrai somente as colunas "Name" e "Codes"
        const extractedPatterns = data
          .filter(item => item.Name && item.Codes) // Remove entradas vazias
          .map(item => ({
            name: item.Name,
            codes: item.Codes.split(', ').map(code => code.trim()) // Converte em array de códigos
          }));

        console.log("✅ Padrões extraídos:", extractedPatterns);
        setPatterns(extractedPatterns);
      } catch (err) {
        console.error("🚨 Erro ao buscar padrões:", err);
        setError("Falha ao carregar padrões da planilha.");
      }
    };

    fetchPatterns();
  }, []);

  // ✅ Processa o upload do PDF e extrai o texto
  const handlePdfUpload = (e) => {
    setError("");
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async function () {
        try {
          const typedArray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let extractedText = "";

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(" ");
            extractedText += "\f" + pageText;
            setUploadProgress(Math.round((pageNum / pdf.numPages) * 100));
          }

          console.log("📄 Texto extraído do PDF:", extractedText);
          setPdfText(extractedText);
        } catch (err) {
          console.error("🚨 Erro na extração do PDF:", err);
          setError("Falha ao extrair o texto do PDF.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError("Por favor, faça o upload de um arquivo PDF válido.");
    }
  };

  // ✅ Analisa o PDF cruzando com os padrões da planilha
  const handleAnalyze = () => {
    if (!pdfText) {
      setError("Nenhum texto extraído do PDF. Faça o upload primeiro.");
      return;
    }
    
    setLoading(true);
    setAnalysisResult("");

    let results = pdfText.split('\f').map((pageText, index) => {
      let foundPatterns = [];

      // 🔍 Percorre os padrões e verifica se algum código aparece no PDF
      patterns.forEach(pattern => {
        const matches = pattern.codes.filter(code => pageText.includes(code));
        if (matches.length > 0) {
          foundPatterns.push({
            name: pattern.name,
            matchedCodes: matches
          });
        }
      });

      return { page: index + 1, patterns: foundPatterns };
    });

    setAnalysisResult(JSON.stringify({ pages: results }, null, 2));
    setLoading(false);
  };

  return (
    <Container>
      <h2 className="mb-4">Análise de Documento</h2>

      {/* ✅ Campo de Prompt Personalizado */}
      <Form.Group controlId="customPrompt" className="mb-3">
        <Form.Label><strong>Prompt Personalizado</strong></Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Digite as instruções para análise..."
        />
      </Form.Group>

      {/* ✅ Exibe padrões em uma tabela compacta */}
      <h5 className="mt-4">Padrões de Busca</h5>
      {patterns.length > 0 ? (
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Códigos</th>
              </tr>
            </thead>
            <tbody>
              {patterns.map((pattern, index) => (
                <tr key={index}>
                  <td>{pattern.name}</td>
                  <td>{pattern.codes.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Alert variant="warning">Nenhum padrão carregado. Verifique a planilha.</Alert>
      )}

      {/* ✅ Upload do PDF */}
      <Form.Group controlId="pdfFile" className="mb-3">
        <Form.Label><strong>Upload do PDF</strong></Form.Label>
        <Form.Control type="file" accept="application/pdf" onChange={handlePdfUpload} />
      </Form.Group>

      <Button variant="primary" onClick={handleAnalyze} disabled={loading || !pdfText}>
        {loading ? 'Analisando...' : 'Analisar PDF'}
      </Button>

      {/* ✅ Barra de progresso */}
      {loading && <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mt-3" />}

      {/* ✅ Exibe erros */}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {/* ✅ Exibe resultado da análise */}
      {analysisResult && (
        <Form.Group controlId="analysisResult" className="mt-3">
          <Form.Label><strong>Resultado da Análise</strong></Form.Label>
          <Form.Control as="textarea" rows={10} value={analysisResult} readOnly />
        </Form.Group>
      )}
    </Container>
  );
};

export default DocumentAnalysis;
