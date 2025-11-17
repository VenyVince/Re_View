// src/components/layout/Header/Header.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';
import NavItem from './NavItem';
import TextInput from '../../ui/TextInput';
import logo from "../../../assets/logo.png";
import { useAuth } from '../../../context/AuthContext';

export default function Header() {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();
    const { auth, logout } = useAuth();  // 🔥 전역 로그인 상태 가져오기

    const handleSearch = () => {
        if (keyword.trim() !== '') {
            navigate(`/search?query=${encodeURIComponent(keyword)}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleLogoClick = () => {
        navigate('/');
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

                {/* 네비 */}
                <nav className="rv-nav">

                    <NavItem label="Product" to ="/product" />
                    <NavItem label="Review" to ="/review" />
                    <NavItem label="About"  to ="/About" />
                    <NavItem label="Q&A" to ="/qna"  />
                </nav>

                <div className="rv-right">
                    {/* 검색창 */}
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

                    {/* ▼ ▼ ▼ 로그인 여부에 따른 UI 변경 ▼ ▼ ▼ */}
                    {!auth.loggedIn ? (
                        // 🔴 로그인 안 된 상태 → 로그인 버튼
                        <button
                            className="rv-login-btn"
                            onClick={() => navigate('/login')}
                        >
                            로그인
                        </button>
                    ) : (
                        // 🟢 로그인 된 상태 → 닉네임 + 마이페이지 + 로그아웃
                        <div className="rv-user-menu">
                            <span className="rv-user-nickname">
                                {auth.userId} 님
                            </span>

                            <Link to="/mypage" className="rv-mypage-btn">
                                마이페이지
                            </Link>

                            <button
                                className="rv-logout-btn"
                                onClick={logout}
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