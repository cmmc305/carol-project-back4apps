'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Parse from '@/utils/back4app';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [organizationId, setOrganizationId] = useState('');

  // Função para buscar os dados existentes no banco de dados
  const fetchSettings = async () => {
    try {
      const query = new Parse.Query('SettingsApi');
      query.equalTo('name', 'OpenAI Settings'); // Filtrar pelo nome
      const result = await query.first();

      if (result) {
        setApiKey(result.get('api_key') || '');
        setOrganizationId(result.get('organization_id') || '');
      }
    } catch (error) {
      console.error('Erro ao buscar configurações do banco de dados:', error);
      toast.error('Erro ao carregar configurações. Tente novamente.');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
        const query = new Parse.Query('SettingsApi');
        query.equalTo('name', 'OpenAI Settings');
        const existingSettings = await query.first();
  
        let SettingsApi;
        if (existingSettings) {
          // Atualizar o objeto existente
          SettingsApi = existingSettings;
        } else {
          // Criar um novo objeto se não existir
          SettingsApi = new Parse.Object('SettingsApi');
          SettingsApi.set('name', 'OpenAI Settings');
        }
  
        SettingsApi.set('api_key', apiKey);
        SettingsApi.set('organization_id', organizationId);
  
        // Salvar no banco de dados
        await SettingsApi.save();
  
        toast.success('Configurações salvas com sucesso no banco de dados!');
      } catch (error) {
        console.error('Erro ao salvar configurações no banco de dados:', error);
        toast.error('Erro ao salvar configurações. Tente novamente.');
      }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Configurações da API OpenAI</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid gap-4">
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
              API Key
            </label>
            <Input
              id="api-key"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Insira sua API Key"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="organization-id" className="block text-sm font-medium text-gray-700">
              Organization ID
            </label>
            <Input
              id="organization-id"
              type="text"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              placeholder="Insira seu Organization ID"
              className="mt-1"
            />
          </div>
          <Button className="mt-4" onClick={handleSave}>
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
}