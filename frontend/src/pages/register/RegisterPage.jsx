import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './RegisterPage.css';
import logo from '../../assets/logo.png';
import { BAUMANN_BADGES, getBaumannBadge } from '../../assets/baumann';

/* -------------------- 더미 API -------------------- */
// 이미 존재하는 이메일 목록 (대소문자 무시)
const TAKEN_EMAILS = ['test@review.com', 'user@example.com', 'admin@review.co.kr'];

function fakeCheckEmail(email) {
    console.log(' [DUMMY] email check:', email);
    return new Promise((resolve) =>
        setTimeout(
            () => resolve({ ok: true, duplicated: TAKEN_EMAILS.includes(email.toLowerCase()) }),
            500
        )
    );
}

function fakeRegister(payload) {
    console.log('📦 [DUMMY] register payload:', payload);
    return new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 600));
}
/* -------------------------------------------------- */

const REQUIRED_TERMS = [
    { id: 't1', label: '이용약관 동의 (필수)' },
    { id: 't2', label: '개인정보 수집·이용 동의 (필수)' },
    { id: 't3', label: '만 14세 이상입니다 (필수)' },
];
const OPTIONAL_TERMS = [{ id: 't4', label: '마케팅 정보 수신 동의 (선택)' }];

export default function RegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const BAUMANN_TYPES = useMemo(() => Object.keys(BAUMANN_BADGES), []);

    const [form, setForm] = useState({
        email: '',
        password: '',
        password2: '',
        name: '',
        nickname: '',
        phone: '',
        baumann: '', // ✅ 기본 비어있음
    });

    // 이메일 중복 체크 상태: idle | checking | ok | dup | invalid
    const [emailStatus, setEmailStatus] = useState('idle');
    const [emailMsg, setEmailMsg] = useState('');

    const [terms, setTerms] = useState(
        [...REQUIRED_TERMS, ...OPTIONAL_TERMS].reduce((acc, t) => ({ ...acc, [t.id]: false }), {})
    );

    // 혹시 외부에서 ORNW 기본값이 주입되는 경우 초기 마운트에 비워줌
    useEffect(() => {
        setForm(prev => (prev.baumann === 'ORNW' ? { ...prev, baumann: '' } : prev));
    }, []);

    // 설문에서 돌아온 경우에만 surveyResult 반영
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
    const isValidEmailFormat = (v) => /\S+@\S+\.\S+/.test(v);
    const isValidPw = (v) => v.length >= 8;
    const isValidPhone = (v) => /^01[0-9]-?\d{3,4}-?\d{4}$/.test(v);
    const isValidBaumann = (v) => BAUMANN_TYPES.includes(v); // 필수

    const allRequiredTermsChecked = REQUIRED_TERMS.every((t) => terms[t.id]);

    // 폼 전체 유효성 + 이메일 중복 상태(OK이어야 함)
    const formValid =
        isValidEmailFormat(form.email) &&
        emailStatus === 'ok' &&
        isValidPw(form.password) &&
        form.password === form.password2 &&
        form.name.trim() &&
        form.nickname.trim() &&
        isValidPhone(form.phone) &&
        isValidBaumann(form.baumann) &&
        allRequiredTermsChecked;

    // --- 이벤트 ---
    const onChange = (e) => {
        const { name, value } = e.target;
        const next = name === 'baumann' ? value.toUpperCase() : value;
        setForm((prev) => ({ ...prev, [name]: next }));

        // 이메일이 바뀌면 중복체크 초기화
        if (name === 'email') {
            setEmailStatus('idle');
            setEmailMsg('');
        }
    };

    const toggleAllTerms = () => {
        const next = !Object.values(terms).every(Boolean);
        setTerms(Object.fromEntries(Object.keys(terms).map(k => [k, next])));
    };

    const toggleOne = (id) => setTerms(prev => ({ ...prev, [id]: !prev[id] }));

    // 이메일 중복확인 버튼 핸들러
    const handleCheckEmail = async () => {
        const email = form.email.trim();
        if (!isValidEmailFormat(email)) {
            setEmailStatus('invalid');
            setEmailMsg('이메일 형식을 확인해 주세요.');
            return;
        }
        setEmailStatus('checking');
        setEmailMsg('중복 확인 중...');
        const res = await fakeCheckEmail(email);
        if (res?.ok) {
            if (res.duplicated) {
                setEmailStatus('dup');
                setEmailMsg('이미 사용 중인 이메일입니다.');
            } else {
                setEmailStatus('ok');
                setEmailMsg('사용 가능한 이메일입니다.');
            }
        } else {
            setEmailStatus('invalid');
            setEmailMsg('이메일 중복 확인에 실패했습니다.');
        }
    };

    // 제출(더미 전송 후 완료 페이지 이동)
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!formValid) return;

        const acceptedTerms = Object.entries(terms)
            .filter(([, checked]) => checked)
            .map(([id]) => id);

        const payload = {
            email: form.email,
            password: form.password,
            name: form.name,
            nickname: form.nickname,
            phone: form.phone,
            baumann_type: form.baumann,
            accepted_terms: acceptedTerms,
        };

        const res = await fakeRegister(payload);
        if (res?.ok) {
            navigate('/register/complete', { state: { payload }, replace: true });
        }
    };

    return (
        <div className="su-container">
            <img src={logo} alt="Re:View 로고" className="su-logo" />
            <br/>

            <form className="su-form" onSubmit={onSubmit}>
                {/* 이메일 + 중복확인 */}
                <label className="su-label">
                    <div>이메일<span className="su-req">*</span></div>
                    <div className="su-row-inline">
                        <input
                            name="email"
                            type="email"
                            placeholder="이메일을 입력해 주세요"
                            value={form.email}
                            onChange={onChange}
                            autoComplete="off"
                            required
                        />
                        <button
                            type="button"
                            className="su-secondary"
                            onClick={handleCheckEmail}
                            disabled={!form.email}
                        >
                            중복확인
                        </button>
                    </div>
                    {/* 메시지 */}
                    {form.email && (
                        <span
                            className="su-help"
                            style={{
                                color:
                                    emailStatus === 'ok' ? '#198754' :
                                        emailStatus === 'dup' || emailStatus === 'invalid' ? '#d32f2f' :
                                            '#666'
                            }}
                        >
              {emailMsg ||
                  (emailStatus === 'idle'
                      ? '이메일 입력 후 중복확인을 눌러주세요.'
                      : '')}
            </span>
                    )}
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
                        autoComplete="off"
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
                        autoComplete="off"
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
                        autoComplete="off"
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
                            {BAUMANN_TYPES.map(k => (<option key={k} value={k} />))}
                        </datalist>

                        <button
                            type="button"
                            className="su-secondary"
                            onClick={() => navigate('/survey/intro')}
                        >
                            내 바우만 타입 찾기
                        </button>
                    </div>

                    {/* 미리보기/검증 */}
                    {form.baumann && !isValidBaumann(form.baumann) && (
                        <span className="su-help">유효한 코드가 아닙니다. (예: DRNT, DSPW 등)</span>
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
                    다음
                </button>
            </form>
        </div>
    );
}