import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Link import
import './Header.css';

export default function NavItem({ to, label }) {
    return (
        <Link
            to={to}
            className="rv-nav__item"
            style={{
                textDecoration: 'none',
                fontSize: 16,
                padding: '8px 12px',
                cursor: 'pointer',
                color: '#111',
            }}
        >
            {label}
        </Link>
    );
}