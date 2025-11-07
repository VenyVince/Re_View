// src/pages/survey/SurveyIntro.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SurveyIntro.css';

export default function SurveyIntro() {
    const navigate = useNavigate();
    return (
        <div className="sv-intro">
            <div className="sv-intro__inner">
                <h1 className="sv-intro__title">피부 타입 설문조사</h1>
                <p className="sv-intro__desc">
                    당신의 피부 타입을 알아보세요. 아래 질문에 답해 주세요.
                </p>
                <button className="sv-intro__cta" onClick={() => navigate('/survey')}>
                    설문하기
                </button>
            </div>
        </div>
    );
}