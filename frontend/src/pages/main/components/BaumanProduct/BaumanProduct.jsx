import React from "react";
import "./BaumanProduct.css";
import bannerImg1 from "../../../../images/banner/banner1.png";

// ✅ 이미지 자동 불러오기 함수
const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => {
    const key = item.replace("./", "").replace(".png", "");
    images[key] = r(item);
  });
  return images;
};

// ✅ 메인 컴포넌트
export default function BaumanProduct() {
  // 피부타입 이미지 자동 불러오기
  const skinTypeImages = importAll(
    require.context("../../../../images/skinType", false, /\.png$/)
  );

  // 태그 아이콘 이미지 자동 불러오기
  const tagImages = importAll(
    require.context("../../../../images/skinTag", false, /\.png$/)
  );

  // 한글 → 영어 매핑 (파일명 연결용)
  const tagNameMap = {
    건성: "dry",
    지성: "oily",
    저자극: "resistant",
    민감성: "sensitive",
    색소성: "pigmented",
    비색소: "nonPigmented",
    탄력: "tight",
    주름: "wrinkled",
  };

  // ✅ 바우만 16가지 타입과 태그
  const skinTypeList = [
    { type: "DRNT", tags: ["건성", "저자극", "비색소", "탄력"] },
    { type: "DRNW", tags: ["건성", "저자극", "비색소", "주름"] },
    { type: "DRPT", tags: ["건성", "저자극", "색소성", "탄력"] },
    { type: "DRPW", tags: ["건성", "저자극", "색소성", "주름"] },
    { type: "DSNT", tags: ["건성", "민감성", "비색소", "탄력"] },
    { type: "DSNW", tags: ["건성", "민감성", "비색소", "주름"] },
    { type: "DSPT", tags: ["건성", "민감성", "색소성", "탄력"] },
    { type: "DSPW", tags: ["건성", "민감성", "색소성", "주름"] },
    { type: "ORNT", tags: ["지성", "저자극", "비색소", "탄력"] },
    { type: "ORNW", tags: ["지성", "저자극", "비색소", "주름"] },
    { type: "ORPT", tags: ["지성", "저자극", "색소성", "탄력"] },
    { type: "ORPW", tags: ["지성", "저자극", "색소성", "주름"] },
    { type: "OSNT", tags: ["지성", "민감성", "비색소", "탄력"] },
    { type: "OSNW", tags: ["지성", "민감성", "비색소", "주름"] },
    { type: "OSPT", tags: ["지성", "민감성", "색소성", "탄력"] },
    { type: "OSPW", tags: ["지성", "민감성", "색소성", "주름"] },
  ];

  // ✅ 현재 타입 (임시로 DRNW 표시)
  const currentType = "DRNW";
  const selectedType = skinTypeList.find((t) => t.type === currentType);

  // ✅ 더미 상품 데이터
 const products = [
   { id: 1, name: "마이크로 폼 클렌저", price: 10000, isBest: true },
   { id: 2, name: "리치 수분 크림", price: 12000, isBest: true },
   { id: 3, name: "센서티브 토너", price: 9000, isBest: false },
   { id: 4, name: "비타민C 세럼", price: 18000, isBest: false },
   { id: 5, name: "클렌징 오일", price: 15000, isBest: false },
   { id: 6, name: "하이드라 젤 크림", price: 14000, isBest: false },
   { id: 7, name: "데일리 모이스처", price: 11000, isBest: false },
   { id: 8, name: "필링 패드", price: 10000, isBest: false },
 ];


  return (
    <section className="bauman-section">
      {/* 상단 제목 */}
      <h2 className="bauman-title">{selectedType.type} 의 추천 상품</h2>

      <div className="bauman-box">
        {/* 상단 영역 */}
        <div className="bauman-wrap">
          {/* 왼쪽 - 대표 이미지 */}
          <div className="bauman-left">
            <img
              src={skinTypeImages[currentType]}
              alt={`${selectedType.type} 대표 이미지`}
              className="bauman-main-img"
            />
          </div>

          {/* 오른쪽 - 타입 정보 및 태그 아이콘 */}
          <div className="bauman-right">
            <h3 className="skin-code">{selectedType.type}</h3>
            <p className="skin-tags">
              {selectedType.tags.map((tag, idx) => (
                <span key={idx}>#{tag} </span>
              ))}
            </p>

            {/* 태그별 아이콘 */}
            <div className="bauman-right_img">
              {selectedType.tags.map((tag, idx) => {
                const englishKey = tagNameMap[tag];
                const tagImg = tagImages[englishKey];
                return (
                  <div key={idx} className="tag-item">
                    <img src={tagImg} alt={tag} className="tag-img" />

                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 상품 리스트 */}
        <div className="product-grid">
          {products.map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-img">
                  {item.isBest && <span className="best-badge">Best</span>}
                <img src={bannerImg1} alt={item.name} />
              </div>
              <div className="product-info">
                <p className="product-name">{item.name}</p>
                <p className="product-price">{item.price.toLocaleString()}원</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
