import React, { useState } from 'react';
import './LoginPage.css';
import logo from '../../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
    const [id, setId] = useState(''); // 🔹 API 명세서에서는 email이 아닌 id 사용
    const [password, setPassword] = useState('');
    const [saveId, setSaveId] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 🔹 API 요청
            const response = await axios.post(
                "/api/auth/login",
                { id, password},
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true, // ✅ 쿠키를 포함해야 할 때 필수
                }
            );

            console.log('✅ 로그인 성공:', response.data);

            const { status, data } = response.data;
            if (status === 200) {
                // 🔹 로그인 성공 시 처리
                alert(`${data.nickname}님 환영합니다!`);
                // 예시: 세션 유지용 사용자 정보 저장
                localStorage.setItem('user', JSON.stringify(data));
                navigate('/');
            }
        } catch (err) {

            if (err.response && err.response.status === 401) {
                setError('아이디 또는 비밀번호가 올바르지 않습니다.');
            } else {
                setError('서버와의 통신 중 오류가 발생했습니다.');
            }

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

            {/* 옵션 */}
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

            {/* 하단 링크 */}
            <div className="login-bottom">
                <span>계정이 없으신가요?</span>
                <Link to="/register">회원가입</Link>
            </div>
        </div>
    );
}