import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, ProgressBar, Table } from 'react-bootstrap';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const DocumentAnalysis = () => {
  const [pdfText, setPdfText] = useState("");
  const [patterns, setPatterns] = useState([]);
  const [analysisResult, setAnalysisResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  // Default prompt (disabled for users)
  const defaultPrompt = "Analyze the document and identify financial patterns based on the extracted text.";
  const [customPrompt, setCustomPrompt] = useState(defaultPrompt);

  // ✅ Fetch patterns from Google Sheets
  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const response = await fetch('https://opensheet.elk.sh/1wpnDIkr7A_RpM8sulHh2OcifbJD7zXol19dlmeJDmug/1');
        if (!response.ok) throw new Error("Error fetching patterns from the spreadsheet.");
        
        const data = await response.json();
        console.log("📊 Google Sheets Data:", data);

        // 🔹 Extract only "Name" and "Codes" columns
        const extractedPatterns = data
          .filter(item => item.Name && item.Codes) // Remove empty entries
          .map(item => ({
            name: item.Name,
            codes: item.Codes.split(', ').map(code => code.trim()) // Convert to array of codes
          }));

        console.log("✅ Extracted Patterns:", extractedPatterns);
        setPatterns(extractedPatterns);
      } catch (err) {
        console.error("🚨 Error fetching patterns:", err);
        setError("Failed to load patterns from Google Sheets.");
      }
    };

    fetchPatterns();
  }, []);

  // ✅ Process PDF upload and extract text
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

          console.log("📄 Extracted PDF Text:", extractedText);
          setPdfText(extractedText);
        } catch (err) {
          console.error("🚨 Error extracting PDF:", err);
          setError("Failed to extract text from the PDF.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  // ✅ Analyze PDF text and compare with patterns from Google Sheets
  const handleAnalyze = () => {
    if (!pdfText) {
      setError("No text extracted from the PDF. Please upload a file first.");
      return;
    }
    
    setLoading(true);
    setAnalysisResult([]);

    let results = pdfText.split('\f').map((pageText, index) => {
      let foundPatterns = [];

      // 🔍 Check if any pattern codes appear in the PDF text
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
    }).filter(page => page.patterns.length > 0); // Remove pages with no matches

    setAnalysisResult(results);
    setLoading(false);
  };

  return (
    <Container>
      <h2 className="mb-4">Document Analysis</h2>

      {/* ✅ Custom Prompt Field (Disabled for users) */}
      <Form.Group controlId="customPrompt" className="mb-3">
        <Form.Label><strong>Custom Prompt</strong></Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={customPrompt}
          disabled
        />
      </Form.Group>

      {/* ✅ Display patterns in a compact table */}
      <h5 className="mt-4">Search Patterns</h5>
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
        <Alert variant="warning">No patterns loaded. Please check the spreadsheet.</Alert>
      )}

      {/* ✅ PDF Upload */}
      <Form.Group controlId="pdfFile" className="mb-3">
        <Form.Label><strong>Upload PDF</strong></Form.Label>
        <Form.Control type="file" accept="application/pdf" onChange={handlePdfUpload} />
      </Form.Group>

      <Button variant="primary" onClick={handleAnalyze} disabled={loading || !pdfText}>
        {loading ? 'Analyzing...' : 'Analyze PDF'}
      </Button>

      {/* ✅ Progress Bar */}
      {loading && <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mt-3" />}

      {/* ✅ Error Messages */}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {/* ✅ Display Analysis Results in a Table */}
      {analysisResult.length > 0 && (
        <div className="mt-4">
          <h5>Analysis Results</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Page</th>
                <th>Matched Patterns</th>
                <th>Matched Codes</th>
              </tr>
            </thead>
            <tbody>
              {analysisResult.map((page, index) => (
                <tr key={index}>
                  <td>{page.page}</td>
                  <td>
                    {page.patterns.map(pattern => (
                      <div key={pattern.name}>
                        <strong>{pattern.name}</strong>
                      </div>
                    ))}
                  </td>
                  <td>
                    {page.patterns.map(pattern => (
                      <div key={pattern.name}>
                        {pattern.matchedCodes.join(", ")}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default DocumentAnalysis;
