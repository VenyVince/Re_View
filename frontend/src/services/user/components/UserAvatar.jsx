// features/user/components/UserAvatar.jsx
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

export default function UserAvatar({ size=24 }) {
    return <FaUserCircle style={{ width:size, height:size }} />;
}