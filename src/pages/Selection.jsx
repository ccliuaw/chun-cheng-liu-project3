import React from 'react';
import { Link } from 'react-router-dom';

export default function Selection() {
    // Using an array to store table data makes the code much cleaner
    const puzzles = [
        { id: 1, name: "The Iron Logic", author: "Brain", difficulty: "Hard (9x9)", path: "/games/normal" },
        { id: 2, name: "Sudoku Inferno", author: "Jack", difficulty: "Hard (9x9)", path: "/games/normal" },
        { id: 3, name: "The Unsolvable", author: "LeBron", difficulty: "Hard (9x9)", path: "/games/normal" }
    ];

    return (
        <div className="static-page-container selection-container">
            <h2 className="page-title">Game Selection</h2>
            <p className="selection-subtitle">
                Choose a specific challenge from our list below.
            </p>

            <table className="selection-table">
                <thead>
                    <tr>
                        <th>Puzzle Name</th>
                        <th>Author</th>
                        <th>Difficulty</th>
                    </tr>
                </thead>
                <tbody>
                    {puzzles.map((puzzle) => (
                        <tr key={puzzle.id}>
                            <td>
                                <Link to={puzzle.path} className="selection-link">
                                    {puzzle.name}
                                </Link>
                            </td>
                            <td>{puzzle.author}</td>
                            <td>{puzzle.difficulty}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="easy-mode-section">
                <p>Or try an easy mode game:</p>
                <Link to="/games/easy">
                    <button className="game-btn btn-easy">Go to Easy Game (6x6)</button>
                </Link>
            </div>

            <div className="normal-mode-section">
                <p>Or try a normal mode game:</p>
                <Link to="/games/normal">
                    <button className="game-btn btn-normal">Go to Normal Game (9x9)</button>
                </Link>
            </div>

        </div>
    );
}
