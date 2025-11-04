import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // ✅ Router 훅

export default function UserAvatar({ size = 24 }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login'); // ✅ 로그인 페이지로 이동
    };

    return (
        <button
            onClick={handleClick}
            aria-label="Go to login page"
            style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <FaUserCircle style={{ width: size, height: size, color: '#111' }} />
        </button>
    );
}