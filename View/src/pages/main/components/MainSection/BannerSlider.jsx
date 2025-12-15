import { useState, useEffect } from "react";
import "./BannerSlider.css";
import dummyData from "../../../../assets/dummyData.png";
import axiosClient from "api/axiosClient";

function BannerSlider() {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // API에서 배너 이미지 가져오기
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axiosClient.get("/api/images/banners");

                // axios는 자동으로 JSON 파싱하므로 response.data 사용
                const formattedImages = response.data.map((src, index) => ({
                    id: index + 1,
                    src: src,
                    alt: `배너${index + 1}`
                }));

                setImages(formattedImages);
            } catch (error) {
                console.error("Error fetching banners:", error);
                // 에러 시 더미 데이터 사용
                setImages([
                    { id: 1, src: dummyData, alt: "배너1" },
                    { id: 2, src: dummyData, alt: "배너2" },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    // ... 나머지 코드는 동일

    // 자동 슬라이드
    useEffect(() => {
        if (images.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [currentIndex, images.length]);

    // 이전 슬라이드
    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    // 다음 슬라이드
    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    // 특정 슬라이드로 이동
    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    if (loading) {
        return <div className="banner-container">로딩 중...</div>;
    }

    if (images.length === 0) {
        return <div className="banner-container">배너 이미지가 없습니다.</div>;
    }

    return (
        <div className="banner-container">
            <div className="banner-wrapper">
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        className={`banner-slide ${
                            index === currentIndex ? "active" : ""
                        }`}
                    >
                        <img src={image.src} alt={image.alt} />
                    </div>
                ))}
            </div>

            {/* 좌우 버튼 */}
            <button className="prev" onClick={prevSlide}>
                &#10094;
            </button>
            <button className="next" onClick={nextSlide}>
                &#10095;
            </button>

            {/* 하단 점 표시 */}
            <div className="dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={index === currentIndex ? "dot active" : "dot"}
                        onClick={() => goToSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
}

export default BannerSlider;