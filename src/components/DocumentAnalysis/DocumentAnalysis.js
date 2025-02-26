// src/components/DocumentAnalysis/DocumentAnalysis.js

import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, ProgressBar, Table } from 'react-bootstrap';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Set the worker source (ensure pdf.worker.min.js is placed in the public folder)
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const DocumentAnalysis = () => {
  const [pdfText, setPdfText] = useState("");
  const [patterns, setPatterns] = useState([]);
  const [analysisResult, setAnalysisResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [customPrompt, setCustomPrompt] = useState("Identify relevant financial patterns in this document.");
  const [formattedResponse, setFormattedResponse] = useState("");

  // Fetch patterns from Google Sheets as JSON (using opensheet API)
  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const response = await fetch('https://opensheet.elk.sh/1wpnDIkr7A_RpM8sulHh2OcifbJD7zXol19dlmeJDmug/1');
        if (!response.ok) throw new Error("Error loading patterns from the spreadsheet.");
        const data = await response.json();
        const extractedPatterns = data
          .filter(item => item.Name && item.Codes)
          .map(item => ({
            name: item.Name,
            codes: item.Codes.split(', ').map(code => code.trim())
          }));
        setPatterns(extractedPatterns);
      } catch (err) {
        console.error("Error fetching patterns:", err);
        setError("Failed to load patterns from the spreadsheet.");
      }
    };

    fetchPatterns();
  }, []);

  // Process PDF upload and extract text using PDF.js
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
          const totalPages = pdf.numPages;
          for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(" ");
            extractedText += "\f" + pageText;
            setUploadProgress(Math.round((pageNum / totalPages) * 100));
          }
          setPdfText(extractedText);
        } catch (err) {
          console.error("Error extracting PDF text:", err);
          setError("Failed to extract text from the PDF.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  // Call the AI API (ChatGPT) to analyze the entire extracted PDF text
  const handleAnalyze = async () => {
    if (!pdfText) {
      setError("No extracted text from PDF. Please upload a file first.");
      return;
    }
    setLoading(true);
    setAnalysisResult("");
    setFormattedResponse("");

    try {
      console.log("Sending request to AI API...");
      const response = await fetch('https://carolsproject-wkzz9vvb.b4a.run/api/analyze-pdf', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pdfText, customPrompt })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unknown error from API");
      console.log("AI API response:", data);
      setFormattedResponse(data.aiAnalysis);
    } catch (err) {
      console.error("Failed to get AI response:", err);
      setError("Failed to get response from AI.");
    }
    setLoading(false);
  };

  return (
    <Container>
      <h2 className="mb-4">Document Analysis</h2>

      {/* Custom Prompt - (Disabled for now if you want to lock it, you can add disabled attribute) */}
      <Form.Group controlId="customPrompt" className="mb-3">
        <Form.Label><strong>Custom Prompt</strong></Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Enter analysis instructions..."
          // disabled // Uncomment this line if you want to disable editing for now
        />
      </Form.Group>

      {/* Display Patterns in a compact table */}
      <h5 className="mt-4">Patterns to Search</h5>
      {patterns.length > 0 ? (
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Codes</th>
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
        <Alert variant="warning">No patterns loaded. Check the spreadsheet.</Alert>
      )}

      {/* PDF Upload Field */}
      <Form.Group controlId="pdfFile" className="mb-3">
        <Form.Label><strong>Upload PDF</strong></Form.Label>
        <Form.Control type="file" accept="application/pdf" onChange={handlePdfUpload} />
      </Form.Group>

      <Button variant="primary" onClick={handleAnalyze} disabled={loading || !pdfText}>
        {loading ? 'Analyzing...' : 'Analyze PDF'}
      </Button>

      {loading && <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mt-3" />}

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {formattedResponse && (
        <Alert variant="success" className="mt-3">
          <h5>AI Analysis Report</h5>
          <pre style={{ whiteSpace: "pre-wrap" }}>{formattedResponse}</pre>
        </Alert>
      )}
    </Container>
  );
};

export default DocumentAnalysis;
