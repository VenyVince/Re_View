import React from 'react';
import Header from '../../components/layout/Header/Header';

export default function MainPage() {
    return (
        <>
            <Header />
            <main style={{ padding: '40px', textAlign: 'center' }}>
                <h2>Main Page</h2>
                <p>여기에 메인 콘텐츠가 들어갑니다.</p>
            </main>
        </>
    );
}