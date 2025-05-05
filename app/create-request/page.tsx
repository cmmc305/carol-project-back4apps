'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Parse from '@/utils/back4app';

export default function CreateRequestPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    requesterEmail: '',
    creditorName: '',
    merchantName: '',
    ein: '',
    ssn: '',
    businessName: '',
    doingBusinessAs: '',
    requestType: '', // Será preenchido automaticamente
    defaultAmount: '',
    additionalEntities: '',
    defaultDate: '',
    address: '',
    state: '',
    city: '',
    zipcode: '',
    emailAddress: '',
    phoneNumber: '',
    pdfAnalysis: '',
  });

  const [uccFiles, setUccFiles] = useState<File[]>([]);
  const [agreementFiles, setAgreementFiles] = useState<File[]>([]);
  const [bankStatementsFiles, setBankStatementsFiles] = useState<File[]>([]);
  const [summonsAndComplaintFiles, setSummonsAndComplaintFiles] = useState<File[]>([]);
  const [judgmentFiles, setJudgmentFiles] = useState<File[]>([]);
  const [uccReleaseFiles, setUccReleaseFiles] = useState<File[]>([]);

  const uccFileInputRef = useRef<HTMLInputElement>(null);
  const agreementFileInputRef = useRef<HTMLInputElement>(null);
  const bankStatementsFileInputRef = useRef<HTMLInputElement>(null);
  const summonsAndComplaintFileInputRef = useRef<HTMLInputElement>(null);
  const judgmentFileInputRef = useRef<HTMLInputElement>(null);
  const uccReleaseFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Preenche o campo requestType com o valor enviado do componente de análise
    const requestType = searchParams.get('type');
    if (requestType) {
      setFormData((prev) => ({ ...prev, requestType }));
    }
  }, [searchParams]);

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File[]>>, files: FileList | null) => {
    if (files) {
      setter((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const CaseRequest = new Parse.Object('CaseRequest');
      Object.keys(formData).forEach((key) => {
        CaseRequest.set(key, formData[key as keyof typeof formData]);
      });

      const uploadFiles = async (files: File[]) => {
        return await Promise.all(
          files.map(async (file) => {
            const parseFile = new Parse.File(file.name, file);
            await parseFile.save();
            return parseFile;
          })
        );
      };

      if (uccFiles.length > 0) {
        const uploadedUccFiles = await uploadFiles(uccFiles);
        CaseRequest.set('uccFiles', uploadedUccFiles);
      }
      if (agreementFiles.length > 0) {
        const uploadedAgreementFiles = await uploadFiles(agreementFiles);
        CaseRequest.set('agreementFiles', uploadedAgreementFiles);
      }
      if (bankStatementsFiles.length > 0) {
        const uploadedBankStatementsFiles = await uploadFiles(bankStatementsFiles);
        CaseRequest.set('bankStatementsFiles', uploadedBankStatementsFiles);
      }
      if (summonsAndComplaintFiles.length > 0) {
        const uploadedSummonsAndComplaintFiles = await uploadFiles(summonsAndComplaintFiles);
        CaseRequest.set('summonsAndComplaintFiles', uploadedSummonsAndComplaintFiles);
      }
      if (judgmentFiles.length > 0) {
        const uploadedJudgmentFiles = await uploadFiles(judgmentFiles);
        CaseRequest.set('judgmentFiles', uploadedJudgmentFiles);
      }
      if (uccReleaseFiles.length > 0) {
        const uploadedUccReleaseFiles = await uploadFiles(uccReleaseFiles);
        CaseRequest.set('uccReleaseFiles', uploadedUccReleaseFiles);
      }

      await CaseRequest.save();
      alert('Request created successfully!');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Create Request</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Linha 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Requester Email</label>
              <input
                type="email"
                value={formData.requesterEmail}
                onChange={(e) => handleInputChange('requesterEmail', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Request Type</label>
              <select
                value={formData.requestType}
                onChange={(e) => handleInputChange('requestType', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                required
              >
                <option value="">Select Request Type</option>
                <option value="Lien">Lien</option>
                <option value="Garnishment">Garnishment</option>
                <option value="Release">Release</option>
              </select>
            </div>
          </div>

          {/* Linha 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Business Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Creditor Name</label>
              <input
                type="text"
                value={formData.creditorName}
                onChange={(e) => handleInputChange('creditorName', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>

          {/* Linha 3 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Merchant Name</label>
              <input
                type="text"
                value={formData.merchantName}
                onChange={(e) => handleInputChange('merchantName', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Doing Business As</label>
              <input
                type="text"
                value={formData.doingBusinessAs}
                onChange={(e) => handleInputChange('doingBusinessAs', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>

          {/* Linha 4 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">EIN</label>
              <input
                type="text"
                value={formData.ein}
                onChange={(e) => handleInputChange('ein', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">SSN</label>
              <input
                type="text"
                value={formData.ssn}
                onChange={(e) => handleInputChange('ssn', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>

          {/* Linha 5 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-medium">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>

          {/* Linha 6 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-medium">Zip Code</label>
              <input
                type="text"
                value={formData.zipcode}
                onChange={(e) => handleInputChange('zipcode', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Email Address</label>
              <input
                type="email"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Phone Number</label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>

          {/* Linha 7 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Default Amount</label>
              <input
                type="number"
                value={formData.defaultAmount}
                onChange={(e) => handleInputChange('defaultAmount', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Default Date</label>
              <input
                type="date"
                value={formData.defaultDate}
                onChange={(e) => handleInputChange('defaultDate', e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>

          {/* Linha 8 */}
          <div>
            <label className="block font-medium">Additional Entities</label>
            <textarea
              value={formData.additionalEntities}
              onChange={(e) => handleInputChange('additionalEntities', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows={3}
            />
          </div>

          {/* Renderização Condicional dos Campos de Upload */}
          {formData.requestType === 'Lien' && (
            <>
              <div>
                <label className="block font-medium">Upload UCC Files</label>
                <input
                  type="file"
                  multiple
                  ref={uccFileInputRef}
                  onChange={(e) => handleFileChange(setUccFiles, e.target.files)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Upload Bank Statements</label>
                <input
                  type="file"
                  multiple
                  ref={bankStatementsFileInputRef}
                  onChange={(e) => handleFileChange(setBankStatementsFiles, e.target.files)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Upload Agreement Files</label>
                <input
                  type="file"
                  multiple
                  ref={agreementFileInputRef}
                  onChange={(e) => handleFileChange(setAgreementFiles, e.target.files)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
            </>
          )}

          {formData.requestType === 'Garnishment' && (
            <>
              <div>
                <label className="block font-medium">Upload Summons and Complaint Files</label>
                <input
                  type="file"
                  multiple
                  ref={summonsAndComplaintFileInputRef}
                  onChange={(e) => handleFileChange(setSummonsAndComplaintFiles, e.target.files)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Upload Judgment Files</label>
                <input
                  type="file"
                  multiple
                  ref={judgmentFileInputRef}
                  onChange={(e) => handleFileChange(setJudgmentFiles, e.target.files)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
            </>
          )}

          {formData.requestType === 'Release' && (
            <>
              <div>
                <label className="block font-medium">Upload UCC Release Files</label>
                <input
                  type="file"
                  multiple
                  ref={uccReleaseFileInputRef}
                  onChange={(e) => handleFileChange(setUccReleaseFiles, e.target.files)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Upload Agreement Files</label>
                <input
                  type="file"
                  multiple
                  ref={agreementFileInputRef}
                  onChange={(e) => handleFileChange(setAgreementFiles, e.target.files)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}