import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import './Find.css';

export default function FindPasswordReset() {
    const nav = useNavigate();
    const { state } = useLocation();
    const email = state?.email || '';

    const [code, setCode] = useState('');
    const [pw, setPw] = useState('');
    const [pw2, setPw2] = useState('');

    const strongPw = (v) => v.length >= 8;

    const onSubmit = (e) => {
        e.preventDefault();
        if (!code.trim()) return alert('인증번호를 입력해 주세요.');
        if (!strongPw(pw)) return alert('비밀번호는 8자 이상이어야 합니다.');
        if (pw !== pw2) return alert('비밀번호가 일치하지 않습니다.');

        // 더미: 인증 성공 + 비번 재설정 성공
        nav('/find/password/done', { replace: true });
    };

    return (
        <div className="find-wrap">
            <header className="find-header">
                <img src={logo} alt="Re:View 로고" className="find-logo" />
            </header>

            <main className="find-main" style={{ maxWidth: 560 }}>
                <form className="find-form" onSubmit={onSubmit}>
                    <label className="find-label">
                        인증번호
                        <input
                            type="text"
                            placeholder="인증번호"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </label>

                    <label className="find-label">
                        새로운 비밀번호
                        <input
                            type="password"
                            placeholder="새로운 비밀번호"
                            value={pw}
                            onChange={(e) => setPw(e.target.value)}
                        />
                    </label>

                    <label className="find-label">
                        새로운 비밀번호 확인
                        <input
                            type="password"
                            placeholder="새로운 비밀번호 확인"
                            value={pw2}
                            onChange={(e) => setPw2(e.target.value)}
                        />
                    </label>

                    <button type="submit" className="find-submit">확인</button>
                </form>
            </main>
        </div>
    );
}