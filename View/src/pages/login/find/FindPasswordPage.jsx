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
            alert('이메일 형식을 확인해 주세요.');
            return;
        }
        // 임시 비밀번호 전송이므로 FindPasswordReset은 생략합니다.
        nav('/find/password/done', { state: { email } });
    };

    return (
        <div className="find-wrap">
            <header className="find-header">
                <img src={logo} alt="Re:View 로고" className="find-logo" />
            </header>

            <main className="find-main" style={{ maxWidth: 560 }}>
                <form className="find-form" onSubmit={handleSubmit}>
                    <label className="find-label">
                        가입시 사용된 이메일을 입력해주세요
                        <input
                            type="email"
                            placeholder="(example : abc@gmail.com)"
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