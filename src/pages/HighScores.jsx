import React, { useEffect, useState } from 'react';

export default function HighScores() {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHighScores = async () => {
            try {
                // Fetch high score data from the backend [cite: 110]
                const response = await fetch('https://chun-cheng-liu-project3.onrender.com/api/sudoku/highscore/list', {
                    credentials: 'include'
                });
                const data = await response.json();

                if (response.ok) {
                    setScores(data);
                } else {
                    setError(data.error || 'Failed to load scores');
                }
            } catch (err) {
                setError('Server connection error');
            } finally {
                setLoading(false);
            }
        };

        fetchHighScores();
    }, []);

    if (loading) return <div className="static-page-container"><h3>Loading High Scores...</h3></div>;
    if (error) return <div className="static-page-container"><h3 style={{ color: 'red' }}>{error}</h3></div>;

    return (
        <div className="static-page-container leaderboard-container">
            <h2 className="page-title">High Scores</h2>
            
            {scores.length === 0 ? (
                <p>No champions yet. Be the first to win!</p>
            ) : (
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Games Won</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score, index) => (
                            <tr key={score.username}>
                                <td className="rank-cell">{index + 1}</td>
                                <td>{score.username}</td>
                                <td className="solved-cell">{score.wins}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}