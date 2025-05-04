'use client';

import React, { useState, useEffect } from 'react';
import Parse from '@/utils/back4app';
import * as pdfjsLib from 'pdfjs-dist';
import { useRouter } from 'next/navigation';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function DocumentAnalysis() {
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; id: string | undefined }[]>([]);
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

        setUploadedFiles((prevFiles) => [...prevFiles, { name: file.name, id: FileObject.id }]);
      } catch (error) {
        console.error('Erro ao fazer upload do arquivo:', error);
      }
    }
  };

  const handleAnalyze = async (fileId: string) => {
    setError('');
    setLoading(true);
    setAnalysisResults([]);

    try {
      const fileObject = uploadedFiles.find((file) => file.id === fileId);
      if (!fileObject) {
        setError('File not found.');
        setLoading(false);
        return;
      }

      const fileUrl = await new Parse.Query('File').get(fileId).then((file) => file.get('file').url());
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

  const handleCreateRequest = () => {
    if (selectedRequestType) {
      router.push(`/create-request?type=${selectedRequestType}`);
    }
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

      <div className="mt-6">
        {uploadedFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between border p-4 rounded mb-2"
          >
            <span>{file.name}</span>
            <button
              onClick={() => file.id && handleAnalyze(file.id)}
              className="bg-green-500 text-white p-2 rounded cursor-pointer hover:bg-green-600"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze PDF'}
            </button>
          </div>
        ))}
      </div>

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