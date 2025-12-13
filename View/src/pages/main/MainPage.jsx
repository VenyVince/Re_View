// src/pages/main/MainPage.jsx
import React, { useEffect, useState } from 'react';
import BannerSlider from './components/MainSection/BannerSlider';
import BestReview from "./components/adminPickReview/AdminPickReview";
import BaumannProduct from "./components/BaumannProduct/BaumannProduct";

export default function MainPage() {
    const [showTopBtn, setShowTopBtn] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowTopBtn(window.scrollY > 300);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            {/* 메인 영역 */}
            <main style={{ padding: '40px', textAlign: 'center' }}>
                {/* 배너 슬라이더 */}
                <BannerSlider />
                {/* 베스트 제품 섹션 */}
                <BestReview />
                {/* 바우만 테스트 추천 상품*/}
                <BaumannProduct />
            </main>

            {showTopBtn && (
                <button
                    className="pd-top-btn"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <span className="top-arrow">∧</span>
                    <span className="top-text">TOP</span>
                </button>
            )}

        </>
    );
}