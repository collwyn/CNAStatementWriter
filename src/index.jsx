import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';  // Make sure this matches the actual file name
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);