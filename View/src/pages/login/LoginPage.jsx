// src/pages/login/LoginPage.jsx
import React, { useState } from 'react';
import './LoginPage.css';
import logo from '../../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from "api/axiosClient";
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    // 입력 값 상태
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    // UI 상태
    const [saveId, setSaveId] = useState(false);  // 아이디 저장 (현재 UI만)
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth(); // 전역 로그인 업데이트

    // ✔ 로그인 요청
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axiosClient.post(
                '/api/auth/login',
                { id, password },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,   // 세션 쿠키(JSESSIONID) 유지 필수
                }
            );

            if (response.status === 200) {
                // 전역 로그인 상태 반영
                login({ id, nickname: id });

                // 권한 체크
                const me = await axiosClient.get("/api/auth/me", { withCredentials: true });

                if (me.data.role === "ROLE_ADMIN") {
                    navigate('/');
                } else {
                    navigate('/');
                }

                return;
            }

            // 그 외 정상 응답이 아니면 오류 처리
            setError("로그인 오류가 발생했습니다.");
        } catch (err) {

            if (err.response) {
                const status = err.response.status;

                if (status === 400 || status === 404) {
                    setError('아이디 또는 비밀번호가 올바르지 않습니다.');
                } else if (status === 401) {
                    setError('영구 제재된 계정입니다. 관리자에게 문의하세요.');
                } else {
                    setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
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

                {/* 에러 메시지 */}
                {error && <p className="error-message">{error}</p>}

                {/* 로그인 버튼 */}
                <button type="submit" disabled={loading}>
                    {loading ? '로그인 중...' : '로그인'}
                </button>
            </form>

            {/* 옵션 영역 */}
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

                {/* 아이디 / 비밀번호 찾기 */}
                <Link to="/find">아이디 / 비밀번호 찾기</Link>
            </div>

            {/* 회원가입 안내 */}
            <div className="login-bottom">
                <span>계정이 없으신가요?</span>
                <Link to="/register">회원가입</Link>
            </div>
        </div>
    );
}
