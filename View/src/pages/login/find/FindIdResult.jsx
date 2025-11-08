import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import './Find.css';

export default function FindIdResult() {
    const nav = useNavigate();
    const { state } = useLocation();
    const email = state?.email || 'unknown@example.com';

    return (
        <div className="find-result-wrap">
            <header className="find-header">
                <img src={logo} alt="Re:View 로고" className="find-logo" />
            </header>

            <main className="find-result-main">
                <hr className="find-divider" />

                <div className="find-result-box">
                    <div className="find-check">✔</div>
                    <h2 className="find-email">{email}</h2>
                    <p className="find-desc">아이디 찾기가 완료되었습니다.</p>

                    <button
                        className="find-login-btn"
                        onClick={() => nav('/login')}
                    >
                        로그인
                    </button>
                </div>

                <hr className="find-divider" />
            </main>
        </div>
    );
}