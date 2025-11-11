// src/pages/main/MainPage.jsx
import React from 'react';
import BannerSlider from './components/MainSection/BannerSlider';
import BestReview from "./components/BestReview/BestReview";
import BaumanProduct from "./components/BaumanProduct/BaumanProduct";

export default function MainPage() {
    return (
        <>
            {/* 메인 영역 */}
            <main style={{ padding: '40px', textAlign: 'center' }}>
                {/* 배너 슬라이더 */}
                <BannerSlider />
                {/* 베스트 제품 섹션 */}
                <BestReview />
                {/* 바우만 테스트 추천 상품*/}
                <BaumanProduct />

            </main>
        </>
    );
}