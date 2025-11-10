import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/*
 * React 18 Entry Point:
 * Uses the new createRoot API for concurrent rendering
 * StrictMode enables additional checks and warnings in development
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
