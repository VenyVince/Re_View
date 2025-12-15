import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import './Find.css';
import axiosClient from "api/axiosClient";

export default function FindPasswordPage() {
    const nav = useNavigate();
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEmail = (v) => /\S+@\S+\.\S+/.test(v);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError('');

        if (!id.trim()) {
            alert('아이디를 입력해 주세요.');
            return;
        }

        if (!isEmail(email)) {
            alert('이메일 형식을 확인해 주세요.');
            return;
        }

        setLoading(true);
        try {
            await axiosClient.post('/api/auth/send-temp-password', { id, email });
            nav('/find/password/done', { state: { email } });
        } catch (err) {
            console.error('API 에러:', err);

            if (err.response) {
                const status = err.response.status;

                if (status === 400) {
                    setError('잘못된 아이디나 이메일입니다.');
                } else if (status === 404) {
                    setError('사용자 정보를 찾을 수 없습니다.');
                } else if (status === 500) {
                    setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
                } else {
                    setError('임시 비밀번호 전송에 실패했습니다. 다시 시도해 주세요.');
                }
            } else {
                setError('네트워크 연결을 확인해 주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="find-wrap">
            <header className="find-header">
                <img src={logo} alt="Re:View 로고" className="find-logo" />
            </header>

            <main className="find-main" style={{ maxWidth: 560 }}>
                <form className="find-form" onSubmit={handleSubmit}>
                    <label className="find-label">
                        아이디를 입력해주세요
                        <input
                            type="text"
                            placeholder="아이디"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            disabled={loading}
                        />
                    </label>

                    <label className="find-label">
                        가입시 사용된 이메일을 입력해주세요
                        <input
                            type="email"
                            placeholder="(example : abc@gmail.com)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </label>

                    <p style={{ fontSize: 12, color: '#666', marginTop: -6 }}>
                        *본인 확인(계정에 등록된 아이디와 이메일)을 통해 비밀번호를 재설정 하실 수 있습니다.
                    </p>

                    {error && (
                        <p style={{ fontSize: 14, color: '#e53e3e', marginTop: 8 }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="find-submit"
                        disabled={loading}
                    >
                        {loading ? '전송 중...' : '다음'}
                    </button>
                </form>
            </main>
        </div>
    );
}