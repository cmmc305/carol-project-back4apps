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
  const [formattedResponse, setFormattedResponse] = useState("");
  const [customPrompt, setCustomPrompt] = useState("Identify relevant financial patterns in the extracted text and summarize the findings.");

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
        setError("Failed to load patterns from the spreadsheet.");
      }
    };

    fetchPatterns();
  }, []);

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

          setPdfText(extractedText);
        } catch (err) {
          setError("Failed to extract text from the PDF.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleAnalyze = async () => {
    if (!pdfText) {
      setError("No extracted text from PDF. Please upload a file first.");
      return;
    }

    setLoading(true);
    setAnalysisResult("");
    setFormattedResponse("");

    let results = pdfText.split('\f').map((pageText, index) => {
      let foundPatterns = [];

      patterns.forEach(pattern => {
        const matches = pattern.codes.filter(code => pageText.includes(code));
        if (matches.length > 0) {
          foundPatterns.push({ name: pattern.name, matchedCodes: matches });
        }
      });

      return { page: index + 1, patterns: foundPatterns };
    });

    setAnalysisResult(JSON.stringify({ pages: results }, null, 2));

    try {
        const response = await fetch('https://carolsproject-wkzz9vvb.b4a.run/api/analyze-text', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: pdfText, customPrompt })
        });
      
        console.log("🔹 API Response Status:", response.status);
        const data = await response.json();
        console.log("✅ API Response Data:", data);
      
        if (!response.ok) throw new Error(data.error || "Unknown error from API");
      
        setFormattedResponse(data.aiAnalysis);
      } catch (err) {
        console.error("🚨 AI API Error:", err);
        setError("Failed to get response from AI.");
      }

    setLoading(false);
  };

  return (
    <Container>
      <h2 className="mb-4">Document Analysis</h2>

      {/* Prompt input field */}
      <Form.Group controlId="customPrompt" className="mb-3">
        <Form.Label><strong>Analysis Prompt</strong></Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Enter analysis instructions..."
        />
      </Form.Group>

      {/* Upload PDF */}
      <Form.Group controlId="pdfFile" className="mb-3">
        <Form.Label><strong>Upload PDF</strong></Form.Label>
        <Form.Control type="file" accept="application/pdf" onChange={handlePdfUpload} />
      </Form.Group>

      {/* Patterns Table */}
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

      <Button variant="primary" onClick={handleAnalyze} disabled={loading || !pdfText}>
        {loading ? 'Analyzing...' : 'Analyze PDF'}
      </Button>

      {loading && <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mt-3" />}

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {formattedResponse && (
        <Alert variant="success" className="mt-3">
          <h5>AI Analysis Report</h5>
          <p>{formattedResponse}</p>
        </Alert>
      )}
    </Container>
  );
};

export default DocumentAnalysis;
