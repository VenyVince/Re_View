// src/pages/main/MainPage.jsx
import React from 'react';
import BannerSlider from '../../components/layout/MainSection/BannerSlider';
import BestReview from "./components/BestReview/BestRivew";

export default function MainPage() {
    return (
        <>

            {/* 메인 영역 */}
            <main style={{ padding: '40px', textAlign: 'center' }}>
                {/* 배너 슬라이더 */}
                <BannerSlider />
                <BestReview />
                {/* 베스트 제품 섹션 */}

            </main>
        </>
    );
}