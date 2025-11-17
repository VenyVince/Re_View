// src/pages/login/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import logo from '../../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    //로그인 폼
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [saveId, setSaveId] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const { login } = useAuth();   // 전역 로그인 상태 업데이트용

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(
                '/api/auth/login',
                { id, password },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            if (response.status === 200 && response.data === "로그인 성공") {
                // 아이디 저장 체크된 경우에만 localStorage에 저장
                if (saveId) {
                    localStorage.setItem('savedId', id);
                } else {
                    localStorage.removeItem('savedId');
                }


                // 로그인 아이디를 userId로 사용
                login({
                    userId: id,
                    role: 'ROLE',   // 나중에 role 내려주면 이 값 교체
                });
                login(id);
                navigate('/');
                return;
            }

            setError('로그인 응답 형식이 올바르지 않습니다.');
        } catch (err) {
            console.error('❌ 로그인 실패:', err);

            if (err.response) {
                switch (err.response.status) {
                    case 400:
                    case 401:
                        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
                        break;
                    default:
                        setError('서버에서 오류가 발생했습니다.');
                        break;
                }
            } else if (err.request) {
                setError('서버와 연결할 수 없습니다. 네트워크를 확인해주세요.');
            } else {
                setError('로그인 요청 중 오류가 발생했습니다.');
            }
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
                    {loading ? '로그인 중...' : '로그인'}
                </button>
            </form>

            <div className="login-options">
                <label>
                    <input
                        type="checkbox"
                        checked={saveId}
                        onChange={() => setSaveId(!saveId)}
                    />
                    아이디 저장
                </label>
                <Link to="/find">아이디 혹은 비밀번호를 잊어버리셨나요?</Link>
            </div>

            <div className="login-bottom">
                <span>계정이 없으신가요?</span>
                <Link to="/register">회원가입</Link>
            </div>
        </div>
    );
}