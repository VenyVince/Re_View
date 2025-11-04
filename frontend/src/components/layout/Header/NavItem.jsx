import React from 'react';
// react-router-dom의 Link 컴포넌트를 사용하여 SPA 내 페이지 이동 구현
//  → a 태그 대신 Link를 써야 페이지가 새로고침되지 않음
import { Link } from 'react-router-dom'; // Router를 쓰는 구조 기준
import './Header.css';

// NavItem 컴포넌트 정의
// props로 to(이동할 경로)와 children(보여줄 텍스트)를 받음
export default function NavItem({ to, children }) {
    return (
        // Link 컴포넌트를 사용해 내부 라우팅
        // className은 스타일 지정용 (Header.css 참고)
        <Link to={to} className="rv-nav__item">
            {children}
        </Link>
    );
}