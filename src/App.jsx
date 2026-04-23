import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { SudokuProvider } from './context/SudokuContext';

// Import all your page components here
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Selection from './pages/Selection';
import NormalGame from './pages/NormalGame';
import EasyGame from './pages/EasyGame';
import Rules from './pages/Rules';
import HighScores from './pages/HighScores';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <SudokuProvider>
      <BrowserRouter>
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Selection />} />
            {/* <Route path="/games/normal" element={<NormalGame />} />
            <Route path="/games/easy" element={<EasyGame />} /> */}
            <Route path="/games/normal/:id" element={<NormalGame />} />
            <Route path="/games/easy/:id" element={<EasyGame />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/scores" element={<HighScores />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </BrowserRouter>
    </SudokuProvider>
  );
}
