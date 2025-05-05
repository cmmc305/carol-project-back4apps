'use client';

import React, { useEffect, useState } from 'react';
import Parse from '@/utils/back4app';

export default function BanksList() {
  const [banks, setBanks] = useState<{ id: string; name: string; phone: string; address: string; fax: string; codes: string[] }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newBank, setNewBank] = useState({ name: '', phone: '', address: '', fax: '', codes: '' });
  const [editingBank, setEditingBank] = useState<{ id: string; name: string; phone: string; address: string; fax: string; codes: string[] } | null>(null);

  useEffect(() => {
    const fetchBanks = async () => {
      const BankAgencyCode = Parse.Object.extend('BankAgencyCode');
      const query = new Parse.Query(BankAgencyCode);

      try {
        const results = await query.find();
        const banksData = results.map((bank) => ({
          id: bank.get('objectId'),
          name: bank.get('bankName'),
          phone: bank.get('phoneNumber'),
          address: bank.get('Address'),
          fax: bank.get('fax'),
          codes: bank.get('codes') || [],
        }));
        setBanks(banksData);
      } catch (error) {
        console.error('Error fetching banks:', error);
      }
    };
    fetchBanks();
  }, []);

  const handleAddBank = async () => {
    const BankAgencyCode = Parse.Object.extend('BankAgencyCode');
    const newBankObject = new BankAgencyCode();

    try {
      newBankObject.set('bankName', newBank.name);
      newBankObject.set('phoneNumber', newBank.phone);
      newBankObject.set('Address', newBank.address);
      newBankObject.set('fax', newBank.fax);
      newBankObject.set('codes', newBank.codes.split(',').map((code) => code.trim()));

      await newBankObject.save();

      setBanks((prevBanks) => [
        ...prevBanks,
        {
          id: newBankObject.id,
          name: newBank.name,
          phone: newBank.phone,
          address: newBank.address,
          fax: newBank.fax,
          codes: newBank.codes.split(',').map((code) => code.trim()),
        },
      ]);

      setIsModalOpen(false);
      setNewBank({ name: '', phone: '', address: '', fax: '', codes: '' });
    } catch (error) {
      console.error('Error adding bank:', error);
    }
  };

  const handleEditBank = async () => {
    if (!editingBank) return;

    const BankAgencyCode = Parse.Object.extend('BankAgencyCode');
    const query = new Parse.Query(BankAgencyCode);

    try {
      const bankToEdit = await query.get(editingBank.id);
      bankToEdit.set('bankName', editingBank.name);
      bankToEdit.set('phoneNumber', editingBank.phone);
      bankToEdit.set('Address', editingBank.address);
      bankToEdit.set('fax', editingBank.fax);
      bankToEdit.set('codes', editingBank.codes);

      await bankToEdit.save();

      setBanks((prevBanks) =>
        prevBanks.map((bank) =>
          bank.id === editingBank.id ? { ...editingBank } : bank
        )
      );

      setIsEditModalOpen(false);
      setEditingBank(null);
    } catch (error) {
      console.error('Error editing bank:', error);
    }
  };

  return (
    <div className="flex flex-col p-6 m-8">
      <h1 className="text-2xl font-bold mb-4">Patterns to Search</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 self-start cursor-pointer hover:bg-blue-600"
      >
        Add Bank
      </button>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Phone Number</th>
            <th className="px-4 py-2 border-b">Address</th>
            <th className="px-4 py-2 border-b">FAX</th>
            <th className="px-4 py-2 border-b">Codes</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((bank) => (
            <tr key={bank.name} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{bank.name}</td>
              <td className="px-4 py-2 border-b">{bank.phone}</td>
              <td className="px-4 py-2 border-b">{bank.address}</td>
              <td className="px-4 py-2 border-b">{bank.fax}</td>
              <td className="px-4 py-2 border-b">{bank.codes.join(', ')}</td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => {
                    setEditingBank(bank);
                    setIsEditModalOpen(true);
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-yellow-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Bank</h2>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newBank.name}
                onChange={(e) => setNewBank({ ...newBank, name: e.target.value })}
                className="border border-gray-300 p-2 rounded"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newBank.phone}
                onChange={(e) => setNewBank({ ...newBank, phone: e.target.value })}
                className="border border-gray-300 p-2 rounded"
              />
              <input
                type="text"
                placeholder="Address"
                value={newBank.address}
                onChange={(e) => setNewBank({ ...newBank, address: e.target.value })}
                className="border border-gray-300 p-2 rounded"
              />
              <input
                type="text"
                placeholder="FAX"
                value={newBank.fax}
                onChange={(e) => setNewBank({ ...newBank, fax: e.target.value })}
                className="border border-gray-300 p-2 rounded"
              />
              <input
                type="text"
                placeholder="Codes (comma-separated)"
                value={newBank.codes}
                onChange={(e) => setNewBank({ ...newBank, codes: e.target.value })}
                className="border border-gray-300 p-2 rounded"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBank}
                  className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editingBank && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Bank</h2>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editingBank.name}
                onChange={(e) =>
                  setEditingBank({ ...editingBank, name: e.target.value })
                }
                className="border border-gray-300 p-2 rounded"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={editingBank.phone}
                onChange={(e) =>
                  setEditingBank({ ...editingBank, phone: e.target.value })
                }
                className="border border-gray-300 p-2 rounded"
              />
              <input
                type="text"
                placeholder="Address"
                value={editingBank.address}
                onChange={(e) =>
                  setEditingBank({ ...editingBank, address: e.target.value })
                }
                className="border border-gray-300 p-2 rounded"
              />
              <input
                type="text"
                placeholder="FAX"
                value={editingBank.fax}
                onChange={(e) =>
                  setEditingBank({ ...editingBank, fax: e.target.value })
                }
                className="border border-gray-300 p-2 rounded"
              />
              <input
                type="text"
                placeholder="Codes (comma-separated)"
                value={editingBank.codes.join(', ')}
                onChange={(e) =>
                  setEditingBank({
                    ...editingBank,
                    codes: e.target.value.split(',').map((code) => code.trim()),
                  })
                }
                className="border border-gray-300 p-2 rounded"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditBank}
                  className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}