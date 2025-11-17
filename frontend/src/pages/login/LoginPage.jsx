// src/pages/login/LoginPage.jsx
import React, { useState } from 'react';
import './LoginPage.css';
import logo from '../../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [saveId, setSaveId] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();   // 전역 로그인 상태 업데이트

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post(
                '/api/auth/login',
                { id, password },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            console.log('✅ 로그인 응답 원본:', res.data);

            // 1) HTTP 상태코드 200 이면 일단 "로그인 성공"으로 처리
            if (res.status === 200) {
                let userId = null;
                let nickname = null;

                // 2-a) 스펙대로 { status, message, data: { user_id, nickname } } 를 보낸 경우
                if (typeof res.data === 'object' && res.data !== null && res.data.data) {
                    const { user_id, nickname: nickFromServer } = res.data.data;
                    userId = user_id;
                    nickname = nickFromServer;
                }
                // 2-b) 현재 컨트롤러처럼 "로그인 성공" 문자열만 보내는 경우
                else {
                    userId = id;        // 일단 입력한 id로 세션 표시
                    nickname = id;      // 헤더에 보여줄 이름도 일단 id 사용
                }

                // 전역 auth 상태 반영
                login({
                    userId,
                    nickname,
                    role: 'USER',   // 나중에 서버에서 role 내려주면 그 값 사용
                });

                alert(`${nickname}님 환영합니다!`);
                navigate('/');
                return;
            }

            // 여기까지 왔다는 건 200이 아닌데 에러도 안 던져진 특이 케이스
            setError('로그인 응답 형식이 올바르지 않습니다.');
        } catch (err) {
            console.error('로그인 에러:', err);

            if (err.response?.status === 401) {
                setError(
                    err.response.data?.message ||
                    '아이디 또는 비밀번호가 올바르지 않습니다.'
                );
            } else {
                setError('서버와의 통신 중 오류가 발생했습니다.');
            }
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
                />
                <input
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="error-message">{error}</p>}

                <button type="submit">로그인</button>
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