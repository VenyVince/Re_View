import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './RegisterComplete.css';
import logo from '../../assets/logo.png';

export default function RegisterComplete() {
    const nav = useNavigate();
    const { state } = useLocation();
    const payload = state?.payload; // 더미 전송 데이터가 넘어옴(선택)

    return (
        <div className="rc-wrap">
            <header className="rc-header">
                <Link to="/" aria-label="홈으로">
                    <img src={logo} alt="Re:View 로고" className="rc-logo" />
                </Link>
            </header>

            <hr className="rc-divider" />

            <main className="rc-main">
                <div className="rc-check" aria-hidden>✓</div>
                <h1 className="rc-title">회원가입이 완료되었습니다</h1>
                <p className="rc-desc">로그인하시면 더욱 다양한 서비스를 제공받으실 수 있습니다.</p>

                <div className="rc-actions">
                    <button className="rc-btn rc-primary" onClick={() => nav('/login')}>로그인</button>
                    <button className="rc-btn" onClick={() => nav('/')}>홈으로</button>
                </div>

                {/* 필요하면 확인용으로 열어보세요 */}
                {/* <pre className="rc-debug">{JSON.stringify(payload, null, 2)}</pre> */}
            </main>

            <hr className="rc-divider" />
        </div>
    );
}