import React from "react";
import { useLocation } from "react-router-dom";

export default function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("query"); // 주소에서 ?query=값 추출

  // 더미 데이터 (임시로 보여줄 상품 목록)
  const dummyResults = [
    { id: 1, name: "수분크림", price: 15000, brand: "Innisfree" },
    { id: 2, name: "클렌징폼", price: 12000, brand: "HERA" },
    { id: 3, name: "선크림", price: 17000, brand: "Dr.G" },
    { id: 4, name: "립밤", price: 9000, brand: "Nivea" },
  ];

  // keyword가 포함된 상품만 필터링
  const results = dummyResults.filter((item) =>
    item.name.includes(keyword)
  );

  return (
    <div style={{ padding: "40px" }}>
      <h2>검색 결과: “{keyword}”</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {results.length > 0 ? (
          results.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                textAlign: "center",
                backgroundColor: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f3f3f3",
                  height: "150px",
                  borderRadius: "6px",
                  marginBottom: "10px",
                }}
              />
              <h3 style={{ fontSize: "16px" }}>{item.name}</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>{item.brand}</p>
              <strong>{item.price.toLocaleString()}원</strong>
            </div>
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
