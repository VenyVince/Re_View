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
                        비밀번호 설정이 완료되었습니다.
                    </h2>
                    <p className="find-desc">
                        로그인하시면 더욱 다양한 서비스를 제공받으실 수 있습니다.
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