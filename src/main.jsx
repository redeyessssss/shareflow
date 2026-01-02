import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Remove StrictMode for production to prevent double ad initialization
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
