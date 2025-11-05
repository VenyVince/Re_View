import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import NavItem from './NavItem';
import TextInput from '../../ui/TextInput';
import UserAvatar from '../../../features/user/components/UserAvatar';
import logo from "../../../assets/logo.png";

export default function Header() {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (keyword.trim() !== '') {
            navigate(`/search?query=${encodeURIComponent(keyword)}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <header className="rv-header">
            <div className="rv-header__inner">
                <img className="rv-header__logo" src={logo} alt="ReView logo" height="40" />
                <nav className="rv-nav">
                    <NavItem label="전체" to ="/" />
                    <NavItem label="카테고리" to ="/categoriy" />
                    <NavItem label="리뷰"  to ="/review" />
                    <NavItem label="문의" to ="/qna"  />
                </nav>

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
                    <UserAvatar size={24} />
                </div>
            </div>
        </header>
    );
}
