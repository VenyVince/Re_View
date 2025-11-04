import React from 'react';
import './Header.css';

// 네비게이션 메뉴 아이템(링크)을 담당하는 하위 컴포넌트
import NavItem from './NavItem';
// 검색창 UI 컴포넌트 (width, height 등 props로 조정 가능)
import TextInput from '../../ui/TextInput';
import UserAvatar from '../../../features/user/components/UserAvatar';

export default function Header() {
    return (
        <header className="rv-header">
            {/* 내부 정렬용 래퍼 (가운데 정렬 및 max-width 제어) */}
            <div className="rv-header__inner">
                <h1 className="rv-header__logo">ReView</h1>

                <nav className="rv-nav">
                    <NavItem to="/">All</NavItem>
                    <NavItem to="/review">Review</NavItem>
                    <NavItem to="/like">Like</NavItem>
                    <NavItem to="/qna">Q&amp;A</NavItem>
                </nav>

                <div className="rv-right">
                    {/* 검색 입력창 컴포넌트 */}
                    <TextInput
                        placeholder="Search..."     // 입력창 힌트 텍스트
                        width={232}                 // 가로길이 (디자인 가이드 기준)
                        height={43}                 // 높이 (디자인 가이드 기준)
                        withIcon                    // 돋보기 아이콘 표시 여부 (불리언)
                        aria-label="search"         // 접근성 라벨 (스크린리더용)
                    />
                    <UserAvatar size={24} />
                </div>
            </div>
        </header>
    );
}