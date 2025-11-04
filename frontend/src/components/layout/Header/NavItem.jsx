import React from 'react';
import './Header.css';

export default function NavItem({ label, onClick }) {
    return (
        <button
            className="rv-nav__item"
            onClick={onClick}
            style={{
                background: 'none',
                border: 'none',
                fontSize: 16,
                cursor: 'pointer',
                padding: '8px 12px',
            }}
        >
            {label}
        </button>
    );
}