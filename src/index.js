import React from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import CaseRequestForm from './src/CaseRequestForm';
import { render } from 'react-dom';

// Registrar como aplicativo web e nativo
AppRegistry.registerComponent(appName, () => CaseRequestForm);

// Renderizar no navegador
const rootTag = document.getElementById('root') || document.createElement('div');
document.body.appendChild(rootTag); // Garante que o root seja adicionado ao body
render(<CaseRequestForm />, rootTag);
