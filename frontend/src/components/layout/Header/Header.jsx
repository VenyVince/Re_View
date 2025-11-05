import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import NavItem from './NavItem';
import TextInput from '../../ui/TextInput';
import UserAvatar from '../../../features/user/components/UserAvatar';

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
                <h1 className="rv-header__logo">ReView</h1>

                <nav className="rv-nav">
                    <NavItem label="All" />
                    <NavItem label="Review" />
                    <NavItem label="Like" />
                    <NavItem label="Q&A" />
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
