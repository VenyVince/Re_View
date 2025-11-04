// components/ui/TextInput.jsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';

export default function TextInput({ width=232, height=43, withIcon=false, ...props }) {
    return (
        <div style={{
            width, height, border:'1px solid #ccc', borderRadius: height/2,
            display:'flex', alignItems:'center', padding:'0 12px', gap:8
        }}>
            {withIcon && <FaSearch style={{ opacity:.6 }} />}
            <input {...props} style={{ flex:1, border:'none', outline:'none', fontSize:14 }} />
        </div>
    );
}