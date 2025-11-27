// src/pages/mypage/admin/adminProductPage.style.js
import styled from "styled-components";

export const Wrap = styled.div`
  background: #fafafa;
  min-height: calc(100vh - 120px); /* 헤더/푸터 빼고 전체 높이 */
`;

export const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 48px;
`;

/** 예전 Layout(220px + 1fr) 그리드는 삭제하고
 *  AdminLayout이 이미 전체 레이아웃을 담당하므로
 *  여기서는 콘텐츠 카드 박스만 잡아준다.
 */
export const Content = styled.section`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 24px 32px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
`;

export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 800;
`;

export const AddButton = styled.button`
  padding: 8px 14px;
  border: 1px solid #111;
  border-radius: 999px;
  background: #111;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
`;

// 상품 카드 그리드
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

export const Badge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 12px;
  background: #f1f5f9;
  border-radius: 6px;
  padding: 4px 6px;
  font-weight: 700;
`;

export const Thumb = styled.div`
  height: 160px;
  background: #efefef;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CardBody = styled.div`
  padding: 12px;
`;

export const Name = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
`;

export const Price = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;

  & > button {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 14px;
  }
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 22px;
`;

export const PagerBtn = styled.button`
  width: 36px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const PageInfo = styled.span`
  font-weight: 600;
  color: #444;
`;

// 🔹 상품이 없을 때 표시할 빈 상태 UI
export const EmptyState = styled.div`
  margin-top: 40px;
  padding: 60px 0;
  text-align: center;
  border-radius: 16px;
  border: 1px dashed #d4d4d8;
  background: #fdfdfd;
  color: #777;

  h3 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #111;
  }

  p {
    font-size: 14px;
    color: #888;
  }
`;

/* 검색바 */
export const SearchRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

export const SearchInput = styled.input`
  flex: 1;
  max-width: 260px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
`;


/* 삭제 모달 */
export const DeleteOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const DeleteBox = styled.div`
  background: #fff;
  padding: 32px 40px;
  border-radius: 16px;
  min-width: 320px;
  text-align: center;
`;

export const DeleteButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 8px;

  button {
    padding: 8px 16px;
    border-radius: 999px;
    cursor: pointer;
    font-size: 14px;
  }

  .cancel-btn {
    border: 1px solid #ccc;
    background: #fff;
  }

  .confirm-btn {
    border: none;
    background: #000;
    padding: 8px 24px;
    color: #fff;
  }
`;