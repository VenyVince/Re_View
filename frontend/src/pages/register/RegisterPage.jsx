import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './RegisterPage.css';
import logo from '../../assets/logo.png';
import { BAUMANN_BADGES, getBaumannBadge } from '../../assets/baumann';
import axios from 'axios';

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

    // 단순 매핑: 코드 → 숫자 ID (1부터 시작)
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
        baumann: '', // DRNT, ORNW 같은 코드
    });

    const [terms, setTerms] = useState(
        [...REQUIRED_TERMS, ...OPTIONAL_TERMS].reduce(
            (acc, t) => ({ ...acc, [t.id]: false }),
            {}
        )
    );

    // 혹시 외부에서 ORNW 기본값이 들어왔다면 비워주기
    useEffect(() => {
        setForm(prev => (prev.baumann === 'ORNW' ? { ...prev, baumann: '' } : prev));
    }, []);

    // 설문 결과에서 돌아온 경우에만 surveyResult 반영
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
                localStorage.removeItem('surveyResult'); // 한 번 쓰고 제거
            }
        } catch {}
    }, [location, BAUMANN_TYPES]);

    // --- 유효성 ---
    const isValidId = (v) => typeof v === 'string' && v.trim().length >= 3;
    const isValidEmailFormat = (v) => /\S+@\S+\.\S+/.test(v);
    const isValidPw = (v) => v.length >= 8;
    const isValidPhone = (v) => /^01[0-9]-?\d{3,4}-?\d{4}$/.test(v);
    const isValidBaumann = (v) => BAUMANN_TYPES.includes(v);
    const allRequiredTermsChecked = REQUIRED_TERMS.every((t) => terms[t.id]);

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

    // 입력 변경 핸들러
    const onChange = (e) => {
        const { name, value } = e.target;
        const next = name === 'baumann' ? value.toUpperCase() : value;
        setForm((prev) => ({ ...prev, [name]: next }));
    };

    // 약관 전체 선택/해제
    const toggleAllTerms = () => {
        const next = !Object.values(terms).every(Boolean);
        setTerms(Object.fromEntries(Object.keys(terms).map(k => [k, next])));
    };

    // 약관 개별 토글
    const toggleOne = (id) =>
        setTerms(prev => ({
            ...prev,
            [id]: !prev[id],
        }));

    // 폼 제출 (회원가입 API 호출)
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!formValid) return;

        const payload = {
            id: form.id,
            password: form.password,
            name: form.name,
            email: form.email,
            nickname: form.nickname,

            // ⚠️ 백엔드 DTO 필드 이름(camelCase)에 맞춰서 보냄
            phoneNumber: form.phone,
            baumannId: BAUMANN_TO_ID[form.baumann],
            role: 'USER',
        };

        console.log('[REGISTER PAYLOAD]', payload);

        try {
            const res = await axios.post(
                '/api/auth/register', // proxy 사용 시 이대로, 아니면 'http://localhost:8080/api/auth/register'
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );

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
            {/* 로고 (링크 없음) */}
            <img src={logo} alt="Re:View 로고" className="su-logo" />
            <br/>

            <form className="su-form" onSubmit={onSubmit}>
                {/* 아이디 */}
                <label className="su-label">
                    <div>아이디<span className="su-req">*</span></div>
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
                    <div>이메일<span className="su-req">*</span></div>
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
                    <div>비밀번호<span className="su-req">*</span></div>
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
                    <div>비밀번호 확인<span className="su-req">*</span></div>
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
                    <div>이름<span className="su-req">*</span></div>
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
                    <div>닉네임<span className="su-req">*</span></div>
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
                    <div>휴대전화 번호<span className="su-req">*</span></div>
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
                    <div>바우만 타입<span className="su-req">*</span></div>
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
                            onClick={() => navigate('/survey/intro')}
                        >
                            내 바우만 타입 찾기
                        </button>
                    </div>

                    {/* 바우만 타입 검증/미리보기 */}
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
                            {[...REQUIRED_TERMS, ...OPTIONAL_TERMS].map((t) => (
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
                    다음
                </button>
            </form>
        </div>
    );
}