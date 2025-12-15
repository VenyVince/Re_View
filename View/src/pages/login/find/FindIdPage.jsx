import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import './Find.css';
import axiosClient from "api/axiosClient";

export default function FindIdPage() {
    const nav = useNavigate();
    const [form, setForm] = useState({ name: '', phone: '' });

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.name.trim() && /^01[0-9]-?\d{3,4}-?\d{4}$/.test(form.phone)) {

            try {
                // 백엔드 API 호출
                const response = await axiosClient.post('/api/auth/find-id', {
                    name: form.name,
                    phone_number: form.phone,
                });

                // 결과값 result로 state로 전달
                nav('/find/id/result', { state: { resultMessage: response.data } });

            } catch (error) {
                if (error.response) {
                    const status = error.response.status;
                    if (status === 404) {
                        // [404] 아이디를 찾을 수 없음
                        alert("입력하신 정보와 일치하는 아이디가 없습니다.");
                    } else if (status === 400) {
                        // [400] 백엔드 오류
                        alert("잘못된 요청입니다. 다시 시도해주세요.");
                    } else {
                        // 그 외 (500 등)
                        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                    }
                } else {
                    // 서버 응답 자체가 없는 경우 (네트워크 문제 등)
                    alert("서버와 연결할 수 없습니다.");
                }
                console.error("API Error:", error);
            }

        } else {
            alert('이름과 휴대폰 번호를 정확히 입력해 주세요.');
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