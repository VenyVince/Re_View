import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import './Find.css';

export default function FindIdPage() {
    const nav = useNavigate();
    const [form, setForm] = useState({ name: '', phone: '' });

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 더미 검증
        if (form.name.trim() && /^01[0-9]-?\d{3,4}-?\d{4}$/.test(form.phone)) {
            // 아이디를 찾았다고 가정
            const dummyEmail = 'test@review.com';
            nav('/find/id/result', { state: { email: dummyEmail } });
        } else {
            alert('입력 정보를 확인해 주세요.');
        }
    };

    return (
        <div className="find-wrap">
            <header className="find-header">
                <img src={logo} alt="Re:View 로고" className="find-logo" />
            </header>

            <main className="find-main">
                <form className="find-form" onSubmit={handleSubmit}>
                    <label className="find-label">
                        이름
                        <input
                            name="name"
                            type="text"
                            placeholder="이름"
                            value={form.name}
                            onChange={onChange}
                        />
                    </label>

                    <label className="find-label">
                        휴대폰 번호
                        <input
                            name="phone"
                            type="tel"
                            placeholder="휴대폰 번호"
                            value={form.phone}
                            onChange={onChange}
                        />
                    </label>

                    <button type="submit" className="find-submit">
                        다음
                    </button>
                </form>
            </main>
        </div>
    );
}