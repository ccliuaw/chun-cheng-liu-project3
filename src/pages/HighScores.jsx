import React from 'react';

export default function HighScores() {
    const leaderboardData = [
        { id: 1, rank: 1, username: "SudokuKing99", solved: 452 },
        { id: 2, rank: 2, username: "LogicMaster", solved: 380 },
        { id: 3, rank: 3, username: "PuzzleQueen", solved: 315 },
        { id: 4, rank: 4, username: "GridRunner", solved: 210 },
        { id: 5, rank: 5, username: "NewbieUser", solved: 15 }
    ];

    return (
        <div className="static-page-container leaderboard-container">
            <h2 className="page-title">Leaderboard</h2>

            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Puzzles Solved</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboardData.map((player) => (
                        <tr key={player.id}>
                            <td className="rank-cell">{player.rank}</td>
                            <td>{player.username}</td>
                            <td className="solved-cell">{player.solved}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
