import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    // 1. 建立 State 來追蹤輸入框的數值與錯誤訊息
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    
    // 用來在註冊成功後進行頁面跳轉
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault(); 
        setErrorMsg(''); // 每次送出前先清空舊的錯誤訊息

        // 2. 基礎防呆：檢查兩次密碼是否一致
        if (password !== verifyPassword) {
            setErrorMsg('Passwords do not match!');
            return;
        }

        try {
            // 3. 發送 API 請求給後端 (注意你的後端 Port 是 8000)
            const response = await fetch('http://localhost:8000/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // include credentials to send cookies (for authentication)
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            // 4. 判斷後端回傳的結果
            if (response.ok) {
                // 註冊成功，跳轉到遊戲選擇頁面
                navigate('/games');
            } else {
                // 註冊失敗 (如帳號已被註冊)，顯示後端回傳的錯誤訊息
                setErrorMsg(data.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration Error:', error);
            setErrorMsg('Cannot connect to the server.');
        }
    };

    // 5. 判斷是否所有欄位都有填寫 (有空白就返回 true)
    const isFormIncomplete = !username || !password || !verifyPassword;

    return (
        <div className="static-page-container auth-page-container">
            <h2 className="page-title">Create Account</h2>

            <form className="auth-card" onSubmit={handleRegister}>
                
                {/* 顯示錯誤訊息的區塊，如果有錯誤才會渲染 */}
                {errorMsg && (
                    <div style={{ color: '#ff4d4f', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                        {errorMsg}
                    </div>
                )}

                <div className="form-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        placeholder="Choose a username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="Create a password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Verify Password</label>
                    <input 
                        type="password" 
                        placeholder="Repeat password" 
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        required 
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="game-btn btn-new auth-btn"
                    disabled={isFormIncomplete} // 規格書要求：欄位空白時禁用按鈕
                    style={{ 
                        opacity: isFormIncomplete ? 0.5 : 1, 
                        cursor: isFormIncomplete ? 'not-allowed' : 'pointer' 
                    }}
                >
                    Sign Up
                </button>

                <p className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Login here</Link>
                </p>
            </form>
        </div>
    );
}