import React from "react";
import "./BaumanProduct.css";
import dummyData from "../../../../assets/dummyData.png";
import { getBaumannBadge } from "../../../../assets/baumann";
import { getTagIcon as getSkinTagIcon } from "../../../../assets/skinTag";


export default function BaumanProduct() {
    const currentType = "DRNW";

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

    const selectedType = skinTypeList.find((t) => t.type === currentType);

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
            <h2 className="bauman-title">{selectedType.type} 의 추천 상품</h2>

            <div className="bauman-box">
                <div className="bauman-wrap">
                    <div className="bauman-left">
                        <img
                            src={getBaumannBadge(currentType)}
                            alt={`${selectedType.type} 대표 이미지`}
                            className="bauman-main-img"
                        />
                    </div>

                    <div className="bauman-right">
                        <h3 className="skin-code">{selectedType.type}</h3>
                        <p className="skin-tags">
                            {selectedType.tags.map((tag, idx) => (
                                <span key={idx}>#{tag} </span>
                            ))}
                        </p>

                        <div className="bauman-right_img">
                            {selectedType.tags.map((tag, idx) => (
                                <div key={idx} className="tag-item">
                                    <img
                                        src={getSkinTagIcon(tag)}
                                        alt={tag}
                                        className="tag-img"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="product-grid">
                    {products.map((item) => (
                        <div key={item.id} className="product-card">
                            <div className="product-img">
                                {item.isBest && <span className="best-badge">Best</span>}
                                <img src={dummyData} alt={item.name} />
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
