import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function UserAvatar({ size = 24 }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login');
    };
    return (
        <button
            onClick={handleClick}
            style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
            }}
            aria-label="Go to login page"
            >
            <FaUserCircle style={{ width: size, height: size, color: '#111' }} />;
        </button>
    );
}



