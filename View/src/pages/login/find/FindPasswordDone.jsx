import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import './Find.css';

export default function FindPasswordDone() {
    const nav = useNavigate();

    return (
        <div className="find-result-wrap">
            <header className="find-header">
                <img src={logo} alt="Re:View 로고" className="find-logo" />
            </header>

            <main className="find-result-main">
                <hr className="find-divider" />
                <div className="find-result-box">
                    <div className="find-check">✓</div>
                    <h2 className="find-email" style={{ fontSize: 28 }}>
                        임시 비밀번호가 전송되었습니다.
                    </h2>
                    <p className="find-desc">
                        이메일을 확인하시고, 로그인 후 비밀번호를 변경해 주세요.
                    </p>

                    <button className="find-login-btn" onClick={() => nav('/login')}>
                        로그인
                    </button>
                </div>
                <hr className="find-divider" />
            </main>
        </div>
    );
}