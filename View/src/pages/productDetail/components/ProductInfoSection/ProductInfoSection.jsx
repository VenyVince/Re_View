import React from "react";
import "./ProductInfoSection.css";

export default function ProductInfoSection({ product }) {

    // product_images가 배열인지 확인하여 이미지 목록 생성
    const images = Array.isArray(product.product_images)
        ? product.product_images
        : [];

    return (
        <div className="pd-info-section">

            <div className="pd-info-images">
                {images.length > 0 ? (
                    images.map((url, idx) => (
                        <div key={idx} className="pd-info-img-box">
                            <img
                                src={url}
                                alt={`상품 상세 이미지 ${idx + 1}`}
                                className="pd-info-img"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                        </div>
                    ))
                ) : (
                    <div className="pd-info-no-image">이미지 없음</div>
                )}
            </div>

        </div>
    );
}
