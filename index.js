import React from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import CaseRequestForm from './src/CaseRequestForm';
import { render } from 'react-dom';

// Renderizar no navegador
AppRegistry.registerComponent(appName, () => CaseRequestForm);
const rootTag = document.getElementById('root') || document.createElement('div');
render(<CaseRequestForm />, rootTag);
