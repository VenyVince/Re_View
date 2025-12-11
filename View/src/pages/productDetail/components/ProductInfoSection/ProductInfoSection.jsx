import React from "react";
import "./ProductInfoSection.css";

export default function ProductInfoSection() {
    const images = [1, 2, 3, 4, 5];

    return (
        <div className="pd-info-section">

            {/* 제목 영역 */}
            <div className="pd-info-title"></div>

            {/* 상품 상세 이미지 리스트 */}
            <div className="pd-info-images">
                {images.map((num) => (
                    <div key={num} className="pd-info-img-box">
                        <div className="pd-info-placeholder">
                            상품 상세 이미지 {num}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
