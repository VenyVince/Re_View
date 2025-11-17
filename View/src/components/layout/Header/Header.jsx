// src/components/layout/Header/Header.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';
import NavItem from './NavItem';
import TextInput from '../../ui/TextInput';
import logo from '../../../assets/logo.png';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

export default function Header() {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();
    const { auth, logout } = useAuth();  // 전역 로그인 상태 + 로그아웃 함수

    const handleSearch = () => {
        if (keyword.trim() !== '') {
            navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleGoLogin = () => {
        navigate('/login');
    };

    const handleGoMyPage = () => {
        navigate('/mypage');
    };

    const handleLogout = async () => {
        try {
            // 서버 세션도 함께 종료
            await axios.post(
                '/api/auth/logout',
                {},
                { withCredentials: true }
            );
        } catch (e) {
            console.error('로그아웃 요청 중 오류:', e);
            // 실패해도 클라이언트 쪽 상태는 일단 비워줌
        } finally {
            logout();       // 전역 auth 초기화
            navigate('/');  // 메인으로 이동
        }
    };

    return (
        <header className="rv-header">
            <div className="rv-header__inner">
                {/* 로고 */}
                <img
                    className="rv-header__logo"
                    src={logo}
                    alt="ReView logo"
                    height="40"
                    onClick={handleLogoClick}
                />

                {/* 상단 네비게이션 */}
                <nav className="rv-nav">
                    <NavItem label="Product" to="/product" />
                    <NavItem label="Review" to="/review" />
                    <NavItem label="About" to="/about" />
                    <NavItem label="Q&A" to="/qna" />
                </nav>

                {/* 우측 검색 + 로그인/마이페이지 영역 */}
                <div className="rv-right">
                    <TextInput
                        placeholder="Search..."
                        width={232}
                        height={43}
                        withIcon
                        aria-label="search"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyPress}
                        onIconClick={handleSearch}
                    />

                    {/* 🔹 로그인 상태에 따른 분기 */}
                    {!auth.loggedIn ? (
                        // 비로그인 상태
                        <div className="rv-auth-area">
                            <button
                                type="button"
                                className="rv-btn rv-btn-primary"
                                onClick={handleGoLogin}
                            >
                                로그인
                            </button>
                            <Link to="/register" className="rv-link">
                                회원가입
                            </Link>
                        </div>
                    ) : (
                        // 로그인 상태
                        <div className="rv-auth-area">
                            <span className="rv-user-label">
                                {auth.userId}
                                {auth.role === 'ROLE_ADMIN' && (
                                    <span className="rv-admin-badge">ADMIN</span>
                                )}
                                님
                            </span>
                            <button
                                type="button"
                                className="rv-btn rv-btn-outline"
                                onClick={handleGoMyPage}
                            >
                                마이페이지
                            </button>
                            <button
                                type="button"
                                className="rv-btn rv-btn-ghost"
                                onClick={handleLogout}
                            >
                                로그아웃
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}