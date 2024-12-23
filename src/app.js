import React from 'react';
import CaseRequestForm from './components/CaseRequestForm';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Case Request Application</h1>
      </header>
      <main className="app-main">
        <CaseRequestForm />
      </main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Case Request Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
