// src/pages/main/MainPage.jsx
import React from 'react';
import Header from '../../components/layout/Header/Header';
import BannerSlider from '../../components/layout/MainSection/BannerSlider';

export default function MainPage() {
    return (
        <>
            {/* 메인 영역 */}
            <main style={{ padding: '40px', textAlign: 'center' }}>
                {/* 배너 슬라이더 */}
                <BannerSlider />

                {/* 베스트 제품 섹션 */}
                <section style={{ marginTop: '40px' }}>
                    <h2>Best 제품</h2>
                    <p>여기에 메인 콘텐츠가 들어갑니다.</p>
                </section>
            </main>
        </>
    );
}