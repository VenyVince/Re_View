import React, { useState } from 'react';
import './LoginPage.css';
import logo from '../../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [saveId, setSaveId] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('로그인 시도:', { email, password, saveId });
        // TODO: 로그인 API 연동
    };

    return (
        <div className="login-container">
            {/* 로고 */}
            <img src={logo} alt="Re:View 로고" className="login-logo" />

            {/* 로그인 폼 */}
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="이메일을 입력해주세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

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