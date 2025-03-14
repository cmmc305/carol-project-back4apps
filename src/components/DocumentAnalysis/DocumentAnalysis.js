// src/components/DocumentAnalysis/DocumentAnalysis.js

import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, ProgressBar, Table } from 'react-bootstrap';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const DocumentAnalysis = () => {
  const [pdfText, setPdfText] = useState("");
  const [patterns, setPatterns] = useState([]);
  const [basicAnalysisResult, setBasicAnalysisResult] = useState(""); // Result from PDF worker pattern matching
  const [formattedResponse, setFormattedResponse] = useState(""); // AI response
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  // The custom prompt field (disabled for now)
  const [customPrompt, setCustomPrompt] = useState("Identify relevant financial patterns in this document.");

  // Fetch patterns from the Google Sheets using the opensheet API
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

  // Handle PDF upload and extract text using PDF.js
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
          let basicResults = []; // to store basic pattern matching result

          for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(" ");
            extractedText += "\f" + pageText;
            setUploadProgress(Math.round((pageNum / totalPages) * 100));

            // Basic analysis on each page using the loaded patterns
            let foundPatterns = [];
            patterns.forEach(pattern => {
              const matches = pattern.codes.filter(code => pageText.includes(code));
              if (matches.length > 0) {
                foundPatterns.push({ name: pattern.name, matchedCodes: matches });
              }
            });
            basicResults.push({ page: pageNum, patterns: foundPatterns });
          }

          setPdfText(extractedText);
          setBasicAnalysisResult(JSON.stringify({ pages: basicResults }, null, 2));
        } catch (err) {
          console.error("Error extracting PDF text:", err);
          setError("Failed to extract text from the PDF.");
        }
      };
      reader.onerror = () => {
        setError("Failed to read the PDF file.");
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  // Call the AI API to analyze the PDF text using the custom prompt
  const handleAnalyze = async () => {
    if (!pdfText) {
      setError("No extracted text from PDF. Please upload a file first.");
      return;
    }
    setLoading(true);
    setFormattedResponse("");
    setError("");

    try {
      console.log("Sending request to AI API...");
      const response = await fetch('https://www.caseappliens.com/api/analyze-pdf', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pdfText, customPrompt })
      });
      const data = await response.json();
      if (!response.ok || !data.aiAnalysis) {
        throw new Error(data.error || "No valid AI response");
      }
      console.log("AI API response:", data);
      setFormattedResponse(data.aiAnalysis);
    } catch (err) {
      console.error("Failed to get AI response:", err);
      setError("Failed to get response from AI. Displaying basic analysis result.");
      // Fallback: use basic analysis result from the PDF worker pattern matching
      setFormattedResponse(basicAnalysisResult);
    }
    setLoading(false);
  };

  return (
    <Container>
      <h2 className="mb-4">Document Analysis</h2>
      
      {/* Custom Prompt (disabled for now) */}
      <Form.Group controlId="customPrompt" className="mb-3">
        <Form.Label><strong>Custom Prompt</strong></Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Enter analysis instructions..."
          disabled
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
      
      {loading && (
        <div className="mb-3">
          <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mt-3" />
        </div>
      )}
      
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      
      {formattedResponse && (
        <Alert variant="success" className="mt-3">
          <h5>Analysis Report</h5>
          <pre style={{ whiteSpace: "pre-wrap" }}>{formattedResponse}</pre>
        </Alert>
      )}
    </Container>
  );
};

export default DocumentAnalysis;
