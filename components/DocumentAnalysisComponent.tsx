'use client';

import React, { useState, useEffect } from 'react';
import Parse from '@/utils/back4app';
import * as pdfjsLib from 'pdfjs-dist';
import { useRouter } from 'next/navigation';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
import ai from '@/utils/generativeai';

export default function DocumentAnalysis() {
  const [uploadedFile, setUploadedFile] = useState<{ name: string; id: string | undefined } | null>(null);
  const [uploadedContract, setUploadedContract] = useState<{ name: string; id: string | undefined } | null>(null);
  const [analysisResults, setAnalysisResults] = useState<{ page: number; patterns: { name: string; matchedCodes: string[] }[] }[]>([]);
  const [codes, setCodes] = useState<{ name: string; codes: string[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const BankAgencyCode = Parse.Object.extend('BankAgencyCode');
        const query = new Parse.Query(BankAgencyCode);
        const results = await query.find();

        const codesData = results.map((bank) => ({
          name: bank.get('bankName'),
          codes: bank.get('codes') || [],
        }));
        setCodes(codesData);
      } catch (err) {
        console.error('Error fetching codes:', err);
        setError('Failed to load codes from the database.');
      }
    };

    fetchCodes();
  }, []);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get('file') as File;

    if (file) {
      try {
        const parseFile = new Parse.File(file.name, file);
        await parseFile.save();

        const FileObject = new Parse.Object('File');
        FileObject.set('name', file.name);
        FileObject.set('file', parseFile);
        await FileObject.save();

        setUploadedFile({ name: file.name, id: FileObject.id });
        setAnalysisResults([]);
        setError('');
      } catch (error) {
        console.error('Erro ao fazer upload do arquivo:', error);
        setError('Erro ao fazer upload do arquivo.');
      }
    }
  };

  const handleUploadContract = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get('file') as File;

    if (file) {
      try {
        const parseFile = new Parse.File(file.name, file);
        await parseFile.save();

        const FileObject = new Parse.Object('File');
        FileObject.set('name', file.name);
        FileObject.set('file', parseFile);
        await FileObject.save();

        setUploadedContract({ name: file.name, id: FileObject.id });
        setAnalysisResults([]);
        setError('');
      } catch (error) {
        console.error('Erro ao fazer upload do arquivo:', error);
        setError('Erro ao fazer upload do arquivo.');
      }
    }
  };

  const handleAnalyze = async () => {
    setError('');
    setLoading(true);
    setAnalysisResults([]);

    try {
      if (!uploadedFile || !uploadedFile.id) {
        setError('File not found.');
        setLoading(false);
        return;
      }

      const fileUrl = await new Parse.Query('File').get(uploadedFile.id).then((file) => file.get('file').url());
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;

      const results = [];
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pageText = content.items.map((item: any) => item.str).join(' ');

        const foundPatterns = codes
          .map((pattern) => ({
            name: pattern.name,
            matchedCodes: pattern.codes.filter((code) => pageText.includes(code)),
          }))
          .filter((pattern) => pattern.matchedCodes.length > 0);

        results.push({ page: pageNum, patterns: foundPatterns });
      }

      setAnalysisResults(results);
    } catch (err) {
      console.error('Error analyzing PDF:', err);
      setError('Failed to analyze the PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!uploadedFile?.id) {
      setError('File not found.');
      return;
    }
    const fileUrl = await new Parse.Query('File').get(uploadedFile.id).then((file) => file.get('file').url());
    const fileResponse = await fetch(fileUrl);
    const fileArrayBuffer = await fileResponse.arrayBuffer();

    if (!uploadedContract?.id) {
      setError('Contract file not found.');
      return;
    }
    const contractUrl = await new Parse.Query('File').get(uploadedContract.id).then((file) => file.get('file').url());
    const contractResponse = await fetch(contractUrl);
    const contractArrayBuffer = await contractResponse.arrayBuffer();
    
    const prompt = `You are an expert document analyst tasked with extracting specific information from two provided PDF documents. Your goal is to carefully read and understand the content of both files and identify the following data points:

1.  **Business Name:** The official name of the business.
2.  **EIN:** The Employer Identification Number.
3.  **Merchant's Name:** The name of the individual acting as the merchant or business owner.
4.  **SSN (Last 4 Digits):** The last four digits of the Social Security Number associated with the merchant or business owner.
5.  **Additional Entities:** Any other business names, organizations, or individuals mentioned in either document that appear to be related or affiliated with the primary business. List each additional entity separately.

Please provide the extracted information in a clear and organized JSON format. If a specific data point is not found in either document, please indicate "Not Found" for that field.

**Documents:**

**Document 1:** [Content of the first PDF will be provided here as base64 or file path, depending on how the Gemini API expects the input]

**Document 2:** [Content of the second PDF will be provided here as base64 or file path, depending on how the Gemini API expects the input]

**Extraction Output Format:**

\`\`\`json
{
  "Business Name": "[Extracted Business Name from either document or Not Found]",
  "EIN": "[Extracted EIN from either document or Not Found]",
  "Merchant's Name": "[Extracted Merchant's Name from either document or Not Found]",
  "SSN (Last 4 Digits)": "[Extracted Last 4 Digits of SSN from either document or Not Found]",
  "Additional Entities": [
    "[Additional Entity 1]",
    "[Additional Entity 2]",
    "[If no additional entities are found, this array should be empty]"
  ]
}
\`\`\`

**Instructions for Processing:**

* Analyze both documents thoroughly.
* Prioritize finding exact matches for the requested data points.
* For "Additional Entities," be inclusive of any related business names or individuals mentioned.
* Ensure the output format strictly adheres to the JSON structure provided.
* If the same information appears in both documents, you only need to include it once in the output.
`;
    const contents = [
      { text: prompt},
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: Buffer.from(fileArrayBuffer).toString('base64'),
        }
      },
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: Buffer.from(contractArrayBuffer).toString('base64'),
        }
      }
    ];
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: contents,
    });
  // Parse IA response (assume response.candidates[0].content.parts[0].text contains the JSON block)
  type ExtractedData = {
    "Business Name"?: string;
    "EIN"?: string;
    "Merchant's Name"?: string;
    "SSN (Last 4 Digits)"?: string;
    "Additional Entities"?: string[];
  };

  let extractedData: ExtractedData = {};
  try {
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const match = text.match(/```json\s*([\s\S]*?)```/);
    if (match) {
      extractedData = JSON.parse(match[1]);
    }
  } catch {
    setError('Failed to parse AI response.');
    return;
  }

  // Prepare query params for create-request page
  const params = new URLSearchParams({
    businessName: extractedData['Business Name'] || '',
    ein: extractedData['EIN'] || '',
    merchantName: extractedData["Merchant's Name"] || '',
    ssn: extractedData['SSN (Last 4 Digits)'] || '',
    additionalEntities: (extractedData['Additional Entities'] || []).join(', '),
    contractFileId: uploadedContract.id || '',
    type: selectedRequestType || '',
  });
    
    router.push(`/create-request?${params.toString()}`); 
  };

  return (
    <div className="flex flex-col p-6 m-8">
      <h1 className="text-2xl font-bold mb-4">Document Analysis</h1>
      <form
        className="flex flex-col space-y-4"
        action="/api/upload"
        method="POST"
        encType="multipart/form-data"
        onSubmit={handleUpload}
      >
        <input
          type="file"
          name="file"
          accept=".pdf"
          className="border border-gray-300 p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded cursor-pointer hover:bg-blue-600">
          Upload
        </button>
      </form>

      {uploadedFile && (
        <div className="flex items-center justify-between border p-4 rounded mb-2">
          <span>{uploadedFile.name}</span>
          <button
            onClick={handleAnalyze}
            className="bg-green-500 text-white p-2 rounded cursor-pointer hover:bg-green-600"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze PDF'}
          </button>
          <button
            onClick={() => { setUploadedFile(null); setAnalysisResults([]); setError(''); }}
            className="bg-gray-400 text-white p-2 rounded cursor-pointer hover:bg-gray-500 ml-2"
            disabled={loading}
          >
            Remove
          </button>
        </div>
      )}

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {analysisResults.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Analysis Results</h2>
          <div className="overflow-y-auto max-h-96 border p-4 rounded">
            {analysisResults.map((result) => (
              <div key={result.page} className="mb-4">
                <h3 className="font-bold">Page {result.page}</h3>
                {result.patterns.length > 0 ? (
                  <ul className="list-disc ml-6">
                    {result.patterns.map((pattern, idx) => (
                      <li key={idx}>
                        <strong>{pattern.name}:</strong> {pattern.matchedCodes.join(', ')}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No patterns found.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {analysisResults.length > 0 && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-6 cursor-pointer hover:bg-blue-600"
        >
          Create Request
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Select Request Type</h2>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => setSelectedRequestType('Lien')}
                className={`p-2 rounded border ${selectedRequestType === 'Lien' ? 'bg-gray-200' : ''} cursor-pointer hover:bg-gray-200`}
              >
                Lien
              </button>
              <button
                onClick={() => setSelectedRequestType('Garnishment')}
                className={`p-2 rounded border ${selectedRequestType === 'Garnishment' ? 'bg-gray-200' : ''} cursor-pointer hover:bg-gray-200`}
              >
                Garnishment
              </button>
              <button
                onClick={() => setSelectedRequestType('Release')}
                className={`p-2 rounded border ${selectedRequestType === 'Release' ? 'bg-gray-200' : ''} cursor-pointer hover:bg-gray-200`}
              >
                Release
              </button>
            </div>
            <form
              className="flex flex-col space-y-4"
              action="/api/upload"
              method="POST"
              encType="multipart/form-data"
              onSubmit={handleUploadContract}
            >
              <input
                type="file"
                name="file"
                accept=".pdf"
                className="border border-gray-300 p-2 rounded"
                required
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded cursor-pointer hover:bg-blue-600">
                Upload
              </button>
            </form>
            {uploadedContract && (
              <div className="flex items-center justify-between border p-4 rounded mb-2">
                <span>{uploadedContract.name}</span>
              </div>
            )}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRequest}
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                disabled={!selectedRequestType}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}