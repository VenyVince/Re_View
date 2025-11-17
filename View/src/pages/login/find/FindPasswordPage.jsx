import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import './Find.css';

export default function FindPasswordPage() {
    const nav = useNavigate();
    const [email, setEmail] = useState('');

    const isEmail = (v) => /\S+@\S+\.\S+/.test(v);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isEmail(email)) {
            alert('아이디(이메일) 형식을 확인해 주세요.');
            return;
        }
        // 더미: 인증번호가 메일로 발송되었다고 가정하고 다음 단계로
        nav('/find/password/reset', { state: { email } });
    };

    return (
        <div className="find-wrap">
            <header className="find-header">
                <img src={logo} alt="Re:View 로고" className="find-logo" />
            </header>

            <main className="find-main" style={{ maxWidth: 560 }}>
                <form className="find-form" onSubmit={handleSubmit}>
                    <label className="find-label">
                        아이디
                        <input
                            type="email"
                            placeholder="아이디(이메일)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                    <p style={{ fontSize: 12, color: '#666', marginTop: -6 }}>
                        *본인 확인(계정에 등록된 이메일)을 통해 비밀번호를 재설정 하실 수 있습니다.
                    </p>

                    <button type="submit" className="find-submit">다음</button>
                </form>
            </main>
        </div>
    );
}