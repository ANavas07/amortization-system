import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
// import 'jsvectormap/dist/css/jsvectormap.css'; //No funciona, da problemas con el css de la libreria
import 'flatpickr/dist/flatpickr.min.css';
import {AuthContextProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <AuthContextProvider>
        < App />
      </AuthContextProvider>
    </Router>
  </React.StrictMode>
);
