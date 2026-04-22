import React from 'react';

export default function Rules() {
    return (
        <div className="static-page-container">
            <h2 className="page-title">How to Play Sudoku</h2>

            <div className="rules-card">
                <h3 className="rules-subtitle">The Basics</h3>
                <p className="rules-text">
                    Sudoku is played on a grid of 9 x 9 spaces. Within the rows and columns are 9 “squares” (made up of 3 x
                    3 spaces). Each row, column and square (9 spaces each) needs to be filled out with the numbers 1-9,
                    without repeating any numbers within the row, column or square.
                </p>

                <h3 className="rules-subtitle">The Rules</h3>
                <ul className="rules-list">
                    <li>Every square has to contain a single number.</li>
                    <li>Only the numbers from 1 through 9 can be used.</li>
                    <li>Each 3×3 box can only contain each number from 1 to 9 once.</li>
                    <li>Each vertical column can only contain each number from 1 to 9 once.</li>
                    <li>Each horizontal row can only contain each number from 1 to 9 once.</li>
                </ul>

                <hr className="rules-divider" />

                <h3 className="rules-subtitle">Credits</h3>
                <div className="credits-section">
                    <p><strong>Created by:</strong> Chun-Cheng Liu</p>
                    <p>
                        <strong>Contact:</strong> 
                        <a href="mailto:liu.chunc@northeastern.edu" className="credits-link"> liu.chunc@northeastern.edu</a>
                    </p>
                    <p>
                        <strong>Socials:</strong> 
                        <a href="#" className="credits-link"> Github</a> | 
                        <a href="#" className="credits-link"> LinkedIn</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
