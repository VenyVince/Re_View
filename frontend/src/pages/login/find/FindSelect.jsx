import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './FindSelect.css';
import logo from '../../../assets/logo.png'; // 경로 주의 (login/find 기준)

export default function FindSelect() {
    const nav = useNavigate();
    const [mode, setMode] = useState('password'); // 기본 선택: 비밀번호 찾기

    const onNext = () => {
        if (mode === 'id') nav('/find/id');
        else nav('/find/password');
    };

    return (
        <div className="fs-wrap">
            {/* 상단 로고 */}
            <header className="fs-header">
                <img src={logo} alt="Re:View 로고" className="fs-logo" />
            </header>

            <main className="fs-main">
                <h1 className="fs-title">찾고자 하는 아이디 / 비밀번호를 선택해주세요.</h1>

                <div className="fs-radio-row">
                    <label className="fs-radio">
                        <input
                            type="radio"
                            name="find"
                            value="id"
                            checked={mode === 'id'}
                            onChange={() => setMode('id')}
                        />
                        <span>아이디 찾기</span>
                    </label>

                    <label className="fs-radio">
                        <input
                            type="radio"
                            name="find"
                            value="password"
                            checked={mode === 'password'}
                            onChange={() => setMode('password')}
                        />
                        <span>비밀번호 찾기</span>
                    </label>
                </div>

                <button className="fs-next" onClick={onNext}>
                    다음
                </button>
            </main>
        </div>
    );
}