'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Parse from '@/utils/back4app';
import { generateRequestPdf } from '@/utils/generateRequestPdf';

export default function CreateRequestPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    processor: '',
    businessName: '',
    ein: '',
    merchantName: '',
    ssn: '',
    balanceDue: '',
    defaultDate: '',
    additionalEntities: '',
    contractFileId: '',
    type: '',
  });

  useEffect(() => {
    // Preenche os campos com os valores vindos da análise
    setFormData((prev) => ({
      ...prev,
      businessName: searchParams.get('businessName') || '',
      ein: searchParams.get('ein') || '',
      merchantName: searchParams.get('merchantName') || '',
      ssn: searchParams.get('ssn') || '',
      additionalEntities: searchParams.get('additionalEntities') || '',
      contractFileId: searchParams.get('contractFileId') || '',
      type: searchParams.get('type') || '',
    }));
  }, [searchParams]);

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const CaseRequest = new Parse.Object('CaseRequest');
      Object.keys(formData).forEach((key) => {
        CaseRequest.set(key, formData[key as keyof typeof formData]);
      });
      await CaseRequest.save();
      generateRequestPdf(formData); // Gera o PDF após salvar
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
          <div>
            <label className="block font-medium">Processor</label>
            <input
              type="text"
              value={formData.processor}
              onChange={(e) => handleInputChange('processor', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Type</label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            >
              <option value="">Select Type</option>
              <option value="Lien">Lien</option>
              <option value="Garnishment">Garnishment</option>
              <option value="Release">Release</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Business Name</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">EIN</label>
            <input
              type="text"
              value={formData.ein}
              onChange={(e) => handleInputChange('ein', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Merchant&#39;s Name</label>
            <input
              type="text"
              value={formData.merchantName}
              onChange={(e) => handleInputChange('merchantName', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">SSN (Last 4 Digits)</label>
            <input
              type="text"
              value={formData.ssn}
              onChange={(e) => handleInputChange('ssn', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Balance Due</label>
            <input
              type="number"
              value={formData.balanceDue}
              onChange={(e) => handleInputChange('balanceDue', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Default Date</label>
            <input
              type="date"
              value={formData.defaultDate}
              onChange={(e) => handleInputChange('defaultDate', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Additional Entities</label>
            <textarea
              value={formData.additionalEntities}
              onChange={(e) => handleInputChange('additionalEntities', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows={3}
            />
          </div>
          <div>
            <label className="block font-medium">Contract File ID</label>
            <input
              type="text"
              value={formData.contractFileId}
              readOnly
              className="w-full border border-gray-300 p-2 rounded bg-gray-100"
            />
          </div>
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