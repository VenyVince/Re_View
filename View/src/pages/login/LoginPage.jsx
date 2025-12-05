// src/pages/login/LoginPage.jsx
import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

export default function LoginPage() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(
                '/api/auth/login',
                { id, password },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );

            if (response.status === 200) {
                login({ id, nickname: id });

                const me = await axios.get("/api/auth/me", { withCredentials: true });

                if (me.data.role === "ROLE_ADMIN") {
                    navigate('/admin/allproducts');
                } else {
                    navigate('/mypage');
                }
                return;
            }

            setError("로그인 오류가 발생했습니다.");
        } catch (err) {
            setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <img src={logo} alt="Re:View 로고" className="login-logo" />

            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="아이디를 입력해주세요"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />

                {error && <p className="error-message">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "로그인 중..." : "로그인"}
                </button>
            </form>
        </div>
    );
}
