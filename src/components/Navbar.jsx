import React from 'react';
import { NavLink } from 'react-router-dom'; 

export default function Navbar() {
  return (
    <nav>
      <h1>Sudoku Master</h1>
      <ul>
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/games" end>Selection Page</NavLink></li>
        <li><NavLink to="/games/normal">Normal Game</NavLink></li>
        <li><NavLink to="/games/easy">Easy Game</NavLink></li>
        <li><NavLink to="/rules">Rules</NavLink></li>
        <li><NavLink to="/scores">High Scores</NavLink></li>
        <li><NavLink to="/login">Login</NavLink></li>
        <li><NavLink to="/register">Register</NavLink></li>
      </ul>
    </nav>
  );
}