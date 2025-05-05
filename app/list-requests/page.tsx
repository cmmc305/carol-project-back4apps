'use client';

import React, { useEffect, useState } from 'react';
import Parse from '@/utils/back4app';
import { useRouter } from 'next/navigation';

export default function ListRequestsPage() {
  const [requests, setRequests] = useState<Parse.Object[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Parse.Object | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const query = new Parse.Query('CaseRequest');
        const results = await query.find();
        setRequests(results);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Failed to fetch requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleEdit = (requestId: string) => {
    router.push(`/create-request?requestId=${requestId}`);
  };

  const handleDelete = (request: Parse.Object) => {
    setSelectedRequest(request);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedRequest) return;
    const requestId = selectedRequest.id;
    setDeletingId(requestId || null);
    setError('');
    setSuccess('');

    try {
      const query = new Parse.Query('CaseRequest');
      if (!requestId) {
        throw new Error('Request ID is undefined.');
      }
      const caseRequest = await query.get(requestId);
      await caseRequest.destroy();

      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );

      setSuccess('Request successfully deleted.');
    } catch (err) {
      console.error('Error deleting request:', err);
      setError('Failed to delete the request. Please try again.');
    } finally {
      setDeletingId(null);
      setShowConfirm(false);
      setSelectedRequest(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedRequest(null);
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null || isNaN(value)) {
      return '-';
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold text-center mb-4">List of Requests</h1>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {success && <div className="text-green-500 text-center mb-4">{success}</div>}

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading requests...</p>
          </div>
        ) : requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300 bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Creditor</th>
                  <th className="border border-gray-300 px-4 py-2">Type</th>
                  <th className="border border-gray-300 px-4 py-2">City</th>
                  <th className="border border-gray-300 px-4 py-2">Phone</th>
                  <th className="border border-gray-300 px-4 py-2">Default Amount</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="border border-gray-300 px-4 py-2">{(request.id ?? '').slice(-6)}</td>
                    <td className="border border-gray-300 px-4 py-2">{request.get('requesterEmail') || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">{request.get('creditorName') || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">{request.get('requestType') || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">{request.get('city') || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">{request.get('phoneNumber') || '-'}</td>
                    <td className="border border-gray-300 px-4 py-2">{formatCurrency(request.get('defaultAmount'))}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 cursor-pointer hover:bg-yellow-600"
                        onClick={() => request.id && handleEdit(request.id)}
                        disabled={deletingId === request.id}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer hover:bg-red-600"
                        onClick={() => handleDelete(request)}
                        disabled={deletingId === request.id}
                      >
                        {deletingId === request.id ? 'Deleting...' : '🗑️ Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No requests found.</p>
        )}

        {showConfirm && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              {selectedRequest && (
                <p>
                  Are you sure you want to delete the request from{' '}
                  <strong>{selectedRequest.get('requesterEmail')}</strong>?
                </p>
              )}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={confirmDelete}
                  disabled={deletingId === selectedRequest?.id}
                >
                  {deletingId === selectedRequest?.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}