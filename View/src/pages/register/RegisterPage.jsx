// src/pages/register/RegisterPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './RegisterPage.css';
import logo from '../../assets/logo.png';
import { BAUMANN_BADGES, getBaumannBadge } from '../../assets/baumann';
import axiosClient from 'api/axiosClient';
import InlineBaumannSurvey from './InlineBaumannSurvey';

const REQUIRED_TERMS = [
    { id: 't1', label: '이용약관 동의 (필수)' },
    { id: 't2', label: '개인정보 수집·이용 동의 (필수)' },
    { id: 't3', label: '만 14세 이상입니다 (필수)' },
];
const OPTIONAL_TERMS = [{ id: 't4', label: '마케팅 정보 수신 동의 (선택)' }];

export default function RegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // baumann 코드 목록 (DRNT, ORNW ...)
    const BAUMANN_TYPES = useMemo(() => Object.keys(BAUMANN_BADGES), []);

    // 코드 → 숫자 ID
    const BAUMANN_TO_ID = useMemo(
        () =>
            BAUMANN_TYPES.reduce((acc, code, i) => {
                acc[code] = i + 1;
                return acc;
            }, {}),
        [BAUMANN_TYPES]
    );

    const [form, setForm] = useState({
        id: '',
        email: '',
        password: '',
        password2: '',
        name: '',
        nickname: '',
        phone: '',
        baumann: '',
    });

    const [terms, setTerms] = useState(
        [...REQUIRED_TERMS, ...OPTIONAL_TERMS].reduce(
            (acc, t) => ({ ...acc, [t.id]: false }),
            {}
        )
    );

    // 설문 박스 열림 여부
    const [showSurvey, setShowSurvey] = useState(false);

    useEffect(() => {
        setForm(prev => (prev.baumann === 'ORNW' ? { ...prev, baumann: '' } : prev));
    }, []);

    // 예전에 /survey 페이지에서 돌아오는 케이스가 있을 수 있으니 기존 로직은 그대로 둠
    useEffect(() => {
        const fromSurvey =
            location.state?.fromSurvey ||
            new URLSearchParams(location.search).get('from') === 'survey';
        if (!fromSurvey) return;

        const raw = localStorage.getItem('surveyResult');
        if (!raw) return;
        try {
            const { type } = JSON.parse(raw) || {};
            if (type && BAUMANN_TYPES.includes(type)) {
                setForm(prev => ({ ...prev, baumann: type }));
                localStorage.removeItem('surveyResult');
            }
        } catch {}
    }, [location, BAUMANN_TYPES]);

    // --- 유효성 ---
    const isValidId = v => typeof v === 'string' && v.trim().length >= 3;
    const isValidEmailFormat = v => /\S+@\S+\.\S+/.test(v);
    const isValidPw = v => v.length >= 8;
    const isValidPhone = v => /^01[0-9]-?\d{3,4}-?\d{4}$/.test(v);
    const isValidBaumann = v => BAUMANN_TYPES.includes(v);
    const allRequiredTermsChecked = REQUIRED_TERMS.every(t => terms[t.id]);

    const formValid =
        isValidId(form.id) &&
        isValidEmailFormat(form.email) &&
        isValidPw(form.password) &&
        form.password === form.password2 &&
        form.name.trim() &&
        form.nickname.trim() &&
        isValidPhone(form.phone) &&
        isValidBaumann(form.baumann) &&
        allRequiredTermsChecked;

    const onChange = e => {
        const { name, value } = e.target;
        const next = name === 'baumann' ? value.toUpperCase() : value;
        setForm(prev => ({ ...prev, [name]: next }));
    };

    const toggleAllTerms = () => {
        const next = !Object.values(terms).every(Boolean);
        setTerms(Object.fromEntries(Object.keys(terms).map(k => [k, next])));
    };

    const toggleOne = id =>
        setTerms(prev => ({
            ...prev,
            [id]: !prev[id],
        }));

    const onSubmit = async e => {
        e.preventDefault();
        if (!formValid) return;

        const payload = {
            id: form.id,
            password: form.password,
            name: form.name,
            email: form.email,
            nickname: form.nickname,

            // 바우만 아이디는 String이여야하고, phoneNumber과 baumannId로 카멜케이스로 작성되어 오류발생한 부분 수정하였습니다.
            phone_number: form.phone,
            baumann_id: form.baumann,
            role: 'USER',
        };

        console.log('[REGISTER PAYLOAD]', payload);

        try {
            const res = await axiosClient.post('/api/auth/register', payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.status === 201 || res.data?.status === 201) {
                navigate('/register/complete', { state: { payload }, replace: true });
            } else {
                alert(res.data?.message || '회원가입에 실패했습니다.');
            }
        } catch (err) {
            console.error('register error', err);
            alert(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="su-container">
            <img src={logo} alt="Re:View 로고" className="su-logo" />
            <br />

            <form className="su-form" onSubmit={onSubmit}>
                {/* 아이디 */}
                <label className="su-label">
                    <div>
                        아이디<span className="su-req">*</span>
                    </div>
                    <input
                        name="id"
                        type="text"
                        placeholder="로그인 아이디를 입력해 주세요 (3자 이상)"
                        value={form.id}
                        onChange={onChange}
                        required
                        autoComplete="username"
                    />
                </label>

                {/* 이메일 */}
                <label className="su-label">
                    <div>
                        이메일<span className="su-req">*</span>
                    </div>
                    <input
                        name="email"
                        type="email"
                        placeholder="이메일을 입력해 주세요"
                        value={form.email}
                        onChange={onChange}
                        required
                        autoComplete="email"
                    />
                </label>

                {/* 비밀번호 */}
                <label className="su-label">
                    <div>
                        비밀번호<span className="su-req">*</span>
                    </div>
                    <input
                        name="password"
                        type="password"
                        placeholder="비밀번호를 입력해 주세요"
                        value={form.password}
                        onChange={onChange}
                        required
                        autoComplete="new-password"
                    />
                    {form.password && !isValidPw(form.password) && (
                        <span className="su-help">비밀번호는 8자 이상이어야 합니다.</span>
                    )}
                </label>

                {/* 비밀번호 확인 */}
                <label className="su-label">
                    <div>
                        비밀번호 확인<span className="su-req">*</span>
                    </div>
                    <input
                        name="password2"
                        type="password"
                        placeholder="비밀번호를 다시 입력해 주세요"
                        value={form.password2}
                        onChange={onChange}
                        required
                        autoComplete="new-password"
                    />
                    {form.password2 && form.password !== form.password2 && (
                        <span className="su-help">비밀번호가 일치하지 않습니다.</span>
                    )}
                </label>

                {/* 이름 */}
                <label className="su-label">
                    <div>
                        이름<span className="su-req">*</span>
                    </div>
                    <input
                        name="name"
                        type="text"
                        placeholder="이름을 입력해 주세요"
                        value={form.name}
                        onChange={onChange}
                        required
                        autoComplete="name"
                    />
                </label>

                {/* 닉네임 */}
                <label className="su-label">
                    <div>
                        닉네임<span className="su-req">*</span>
                    </div>
                    <input
                        name="nickname"
                        type="text"
                        placeholder="닉네임을 입력해 주세요"
                        value={form.nickname}
                        onChange={onChange}
                        required
                        autoComplete="nickname"
                    />
                </label>

                {/* 휴대전화 */}
                <label className="su-label">
                    <div>
                        휴대전화 번호<span className="su-req">*</span>
                    </div>
                    <input
                        name="phone"
                        type="tel"
                        placeholder="전화번호를 입력해 주세요"
                        value={form.phone}
                        onChange={onChange}
                        required
                        autoComplete="tel"
                    />
                    {form.phone && !isValidPhone(form.phone) && (
                        <span className="su-help">예) 010-1234-5678</span>
                    )}
                </label>

                {/* 바우만 타입 + 버튼 */}
                <label className="su-label">
                    <div>
                        바우만 타입<span className="su-req">*</span>
                    </div>
                    <div className="su-row-inline">
                        <input
                            name="baumann"
                            list="baumann-list"
                            placeholder="바우만 타입을 입력해 주세요 (예: DRNT)"
                            value={form.baumann}
                            onChange={onChange}
                            autoComplete="off"
                            required
                        />
                        <datalist id="baumann-list">
                            {BAUMANN_TYPES.map(k => (
                                <option key={k} value={k} />
                            ))}
                        </datalist>

                        <button
                            type="button"
                            className="su-secondary"
                            onClick={() => setShowSurvey(true)}
                        >
                            내 바우만 타입 찾기
                        </button>
                    </div>

                    {form.baumann && !isValidBaumann(form.baumann) && (
                        <span className="su-help">
                            유효한 코드가 아닙니다. (예: DRNT, DSPW 등)
                        </span>
                    )}
                    {BAUMANN_TYPES.includes(form.baumann) && (
                        <div className="su-badge-preview">
                            <img src={getBaumannBadge(form.baumann)} alt={form.baumann} />
                            <span>{form.baumann}</span>
                        </div>
                    )}
                </label>

                {/* 인라인 설문 */}
                {showSurvey && (
                    <div className="su-baumann-survey">
                        <InlineBaumannSurvey
                            onComplete={type => {
                                setForm(prev => ({ ...prev, baumann: type }));
                                setShowSurvey(false);
                            }}
                            onCancel={() => setShowSurvey(false)}
                        />
                    </div>
                )}

                <hr className="su-sep" />

                {/* 약관 */}
                <div className="su-terms">
                    <div className="su-terms-title">
                        약관 및 개인정보수집 동의<span className="su-req">*</span>
                    </div>
                    <div className="su-terms-box">
                        <label className="su-check all">
                            <input
                                type="checkbox"
                                checked={Object.values(terms).every(Boolean)}
                                onChange={toggleAllTerms}
                            />
                            <span>모두 동의합니다.</span>
                        </label>

                        <ul className="su-terms-list">
                            {[...REQUIRED_TERMS, ...OPTIONAL_TERMS].map(t => (
                                <li key={t.id}>
                                    <label className="su-check">
                                        <input
                                            type="checkbox"
                                            checked={!!terms[t.id]}
                                            onChange={() => toggleOne(t.id)}
                                        />
                                        <span>{t.label}</span>
                                    </label>
                                    <button type="button" className="su-link">
                                        자세히보기
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <button type="submit" className="su-submit" disabled={!formValid}>
                    회원가입
                </button>
            </form>
        </div>
    );
}