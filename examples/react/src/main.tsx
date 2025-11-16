import React from 'react'
import ReactDOM from 'react-dom/client'
// Import the new wrapper-based example by default (Recommended)
import AppWithWrapper from './AppWithWrapper'
// Import the original ref-based example (Alternative)
// import App from './App';
import './index.css'

/*
 * React 18 Entry Point:
 * Uses the new createRoot API for concurrent rendering
 * StrictMode enables additional checks and warnings in development
 *
 * By default, uses AppWithWrapper (React wrapper component).
 * Switch to App to see the direct Web Component approach with refs.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithWrapper />
    {/* <App /> - Uncomment to use ref-based approach */}
  </React.StrictMode>
)
