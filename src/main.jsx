import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import './App.css'; // 確保載入你的全域 CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);