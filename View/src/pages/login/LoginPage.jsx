// src/pages/login/LoginPage.jsx
import React, { useState } from 'react';
import './LoginPage.css';
import logo from '../../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    // 입력 값 상태
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    // UI 상태
    const [saveId, setSaveId] = useState(false);     // 단순 UI용 (실제 저장 X)
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth(); // 전역 로그인 상태 변경 함수

    // 로그인 요청
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
                    withCredentials: true,   // 세션 쿠키(JSESSIONID) 유지 필수
                }
            );

            // ✔ 현재 백엔드는 "로그인 성공" 문자만 반환
            if (response.status === 200) {
                // 전역 로그인 상태 업데이트
                // - 서버가 userId/role을 내려주지 않으므로 로그인 ID만 전달
                login(id);

                navigate('/');
                return;
            }

            setError('로그인 응답 형식이 올바르지 않습니다.');
        } catch (err) {
            console.error('❌ 로그인 실패:', err);

            if (err.response) {
                // 서버가 응답한 HTTP 오류
                if (err.response.status === 400) {
                    setError('아이디 또는 비밀번호가 올바르지 않습니다.');
                }

                // 401번은 영구 제제 사용자에게 발생하는 상태코드입니다. 12/01 이재빈
                else if (err.response.status === 401) {
                    setError('영구 제재 조치를 받은 회원입니다. 관리자에게 문의하세요.');
                }

                else {
                    setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                }
            } else if (err.request) {
                // 요청은 갔지만 응답이 없는 경우 (네트워크 문제 등)
                setError('서버와 연결할 수 없습니다. 네트워크를 확인해주세요.');
            } else {
                // 요청 생성 중 자체 오류
                setError('로그인 요청 중 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <img src={logo} alt="Re:View 로고" className="login-logo" />

            {/* 로그인 폼 */}
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

                {/* 로그인 버튼 */}
                <button type="submit" disabled={loading}>
                    {loading ? '로그인 중...' : '로그인'}
                </button>
            </form>

            {/* 아이디 저장 UI (현재 기능 없음) */}
            <div className="login-options">
                <label>
                    <input
                        type="checkbox"
                        checked={saveId}
                        onChange={() => setSaveId(!saveId)}
                        disabled={loading}
                    />
                    아이디 저장
                </label>
                <Link to="/find">아이디 혹은 비밀번호를 잊어버리셨나요?</Link>
            </div>

            {/* 회원가입 링크 */}
            <div className="login-bottom">
                <span>계정이 없으신가요?</span>
                <Link to="/register">회원가입</Link>
            </div>
        </div>
    );
}