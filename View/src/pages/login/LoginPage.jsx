// src/pages/login/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import logo from '../../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    // 🔹 입력 폼 상태
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [saveId, setSaveId] = useState(false);     // "아이디 저장" 체크 여부
    const [error, setError] = useState('');          // 에러 메시지
    const [loading, setLoading] = useState(false);   // 로그인 요청 중 여부

    const navigate = useNavigate();
    const { login } = useAuth();  // 전역 로그인 상태 갱신 함수 (AuthContext에서 가져옴)

    // 🔹 페이지 처음 열릴 때, 저장된 아이디 있으면 불러오기
    useEffect(() => {
        const savedId = localStorage.getItem('savedId');
        if (savedId) {
            setId(savedId);
            setSaveId(true);
        }
    }, []);

    // 🔹 로그인 폼 제출
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
                    withCredentials: true,   // 세션 쿠키를 주고받기 위해 필요
                }
            );

            // 👉 지금 백엔드는 "로그인 성공" 같은 문자열만 반환하는 상태라고 했으니까
            // HTTP 200 + 응답 문자열이 "로그인 성공" 이면 성공으로 처리
            if (response.status === 200 && response.data === '로그인 성공') {

                // ✅ 1) 아이디 저장 체크된 경우에만 localStorage에 저장
                if (saveId) {
                    localStorage.setItem('savedId', id);
                } else {
                    localStorage.removeItem('savedId');
                }

                // ✅ 2) 전역 auth 상태 갱신
                //    - 백엔드에서 아직 userId / role을 안 내려주기 때문에
                //      일단 로그인한 id만 넘겨준다.
                //    - AuthContext 내부에서 /api/auth/me 를 다시 호출해서
                //      실제 role(ROLE_ADMIN / ROLE_USER) 을 채우는 구조로 설계.
                login(id);

                // ✅ 3) 메인 페이지로 이동
                navigate('/');
                return;
            }

            // 여기까지 오면 200이 아니거나 응답 문자열이 예상과 다른 경우
            setError('로그인 응답 형식이 올바르지 않습니다.');
        } catch (err) {
            console.error('❌ 로그인 실패:', err);

            // 서버에서 401 같은 에러 코드를 내려주는 경우
            if (err.response) {
                switch (err.response.status) {
                    case 400:
                    case 401:
                        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
                        break;
                    default:
                        setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                        break;
                }
            } else if (err.request) {
                // 요청은 갔지만 응답이 안 온 경우 (네트워크 문제 등)
                setError('서버와 연결할 수 없습니다. 네트워크를 확인해주세요.');
            } else {
                // 요청 자체가 만들어지기 전에 에러가 난 경우
                setError('로그인 요청 중 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* 로고 */}
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

                {/* 로그인 버튼 (로딩 중일 때 텍스트 변경) */}
                <button type="submit" disabled={loading}>
                    {loading ? '로그인 중...' : '로그인'}
                </button>
            </form>

            {/* 아이디 저장 / 찾기 */}
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