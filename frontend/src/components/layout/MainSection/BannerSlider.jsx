import { useState, useEffect } from "react";
import "./BannerSlider.css";

function BannerSlider() {
  const images = [
    { id: 1, src: "/images/banner1.jpg", alt: "배너1" },
    { id: 2, src: "/images/banner2.jpg", alt: "배너2" },
    { id: 3, src: "/images/banner3.jpg", alt: "배너3" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // 3초마다 이동
    return () => clearInterval(interval);
  }, [currentIndex]);

  // 다음 슬라이드
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  // 이전 슬라이드
  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // 특정 슬라이드로 이동
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

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
