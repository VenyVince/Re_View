// src/pages/review/ReviewWrite.style.js
import styled from "styled-components";

export const Wrap = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 80px 40px 120px;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui,
    sans-serif;
`;

export const Inner = styled.div`
  width: 100%;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 900;
    margin: 0 0 4px;
    text-align: center;
`;

export const SubTitle = styled.p`
    margin: 0 0 16px;
    text-align: center;
    color: #6b7280;
    font-size: 14px;
`;

export const Panel = styled.div`
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 28px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Row = styled.div`
  display: flex;
  align-items: ${({ $fullHeight }) => ($fullHeight ? "flex-start" : "center")};
  gap: 10px;
    border-top: 1px solid #e5e7eb;
    padding: 20px 0 3px;
`;

export const Label = styled.div`
  width: 120px;
  font-size: 17px;
  font-weight: 600;
  color: #4b5563;
  flex-shrink: 0;
  padding-top: 4px;
`;

export const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

export const ProfileName = styled.div`
  font-size: 18px;
  font-weight: 500;
`;

export const ProductBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;


export const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
    width: 100%;
`;

// 상품명 + 가격 한 줄
export const ProductTop = styled.div`
    width: 100%;
    display: flex;
  align-items: baseline;
    width: 100%;
    
    /* 왼쪽 덩어리 + 오른쪽 날짜 */
    .left-info {
        display: flex;
        align-items: baseline;
        gap: 5px; /* 상품명/가격 사이 간격 */
    }
`;

export const ProductName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

export const PriceText = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #ef4444;
`;

// 별점 선택 영역
export const RatingSelect = styled.div`
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const StarButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 18px;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#f59e0b" : "#e5e7eb")};

  &:focus {
    outline: none;
  }
`;

export const RatingValue = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

// 구매 날짜
export const PurchaseDate = styled.div`
    margin-left: auto;
    font-size: 12px;
    color: #9ca3af;
`;

export const TextArea = styled.textarea`
    width: 100%;
    min-height: 180px;
    padding: 16px;
    font-size: 14px;
    line-height: 1.6;
    resize: none;

    background-color: #fefefe;
    color: #2f2f2f;

    border-radius: 12px;
    border: 1px solid #e5e1dc;

    transition: border-color 0.2s ease, background-color 0.2s ease;

    &::placeholder {
        color: #9a948c;
    }

    &:hover {
        border-color: #fcfcfc;
    }

    &:focus {
        outline: none;
        border-color: #c7c1ba;
        background-color: #ffffff;
    }
`;

export const Helper = styled.p`
  margin-top: 6px;
  font-size: 12px;
    color: ${({ $valid, $warning }) =>
            $valid 
                    ? "#6b7280" // 충족
                    : $warning 
                            ? "#6b7280"  // 입력 유도
                            : "#dc2626"}; // 진짜 에러
`;

export const FooterRow = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
`;

export const SubmitBtn = styled.button`
  min-width: 96px;
  padding: 10px 24px;
  border-radius: 999px;
  border: none;
  background: #111827;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }

  &:not(:disabled):hover {
    opacity: 0.9;
  }

  &:active {
    transform: translateY(1px);
  }
`;

