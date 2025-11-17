import styled from "styled-components";

export const Wrap = styled.div`
  background: #fafafa;
  min-height: calc(100vh - 120px);
`;

export const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 48px;
`;

/* 공통 제목 */
export const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 24px;
`;

/* ====== 유저 목록 ====== */

export const UserList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid #e5e7eb;
`;

export const UserRow = styled.li`
  display: flex;
  align-items: center;
  padding: 18px 8px;
  border-bottom: 1px solid #e5e7eb;
`;

export const Avatar = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 999px;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 26px;
  color: #9ca3af;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserName = styled.span`
  font-size: 16px;
  font-weight: 700;
`;

export const UserRole = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

export const UserRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const WarningText = styled.span`
  font-size: 14px;
  color: #b91c1c;
  font-weight: 600;
`;

export const IconButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
`;

/* 페이지네이션 */
export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
`;

export const PagerBtn = styled.button`
  width: 36px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

export const PageInfo = styled.span`
  font-weight: 600;
  color: #444;
`;

/* ====== 경고 모달 ====== */

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const ModalBox = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 40px 60px;
  min-width: 520px;
  max-width: 640px;
  text-align: center;
`;

export const ModalTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 24px;
`;

export const ModalTextarea = styled.textarea`
  width: 100%;
  min-height: 220px;
  border-radius: 16px;
  border: 1px solid #d1d5db;
  padding: 18px;
  font-size: 15px;
  resize: none;
  outline: none;

  &::placeholder {
    color: #9ca3af;
  }
`;

export const ModalButtons = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 16px;

  button {
    min-width: 120px;
    padding: 10px 26px;
    border-radius: 999px;
    border: 1px solid #000;
    font-size: 15px;
    cursor: pointer;
  }

  button:first-child {
    background: #fff;
    color: #111;
  }

  button:last-child {
    background: #000;
    color: #fff;
  }
`;

/* ====== 경고 결과 화면 ====== */

export const WarnWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
`;

export const WarnCard = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

export const MainButtonWrap = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
`;

export const MainButton = styled.button`
  min-width: 180px;
  padding: 10px 30px;
  border-radius: 999px;
  border: 1px solid #000;
  background: #000;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;

/* ====== 유저 상세(주문/배송/결제/포인트) ====== */

export const UserHeader = styled.div`
  background: #111827;
  color: #fff;
  border-radius: 14px 14px 0 0;
  padding: 18px 24px;
  display: flex;
  align-items: center;
`;

export const UserHeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserHeaderName = styled.span`
  font-size: 16px;
  font-weight: 700;
`;

export const UserHeaderRole = styled.span`
  font-size: 13px;
  opacity: 0.8;
`;

export const UserHeaderRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 13px;
`;

export const HeaderStat = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;

  span:first-child {
    opacity: 0.7;
    margin-bottom: 4px;
  }

  span:last-child {
    font-weight: 700;
  }
`;

export const DetailBody = styled.div`
  background: #fff;
  border-radius: 0 0 14px 14px;
  border: 1px solid #e5e7eb;
  border-top: none;
  overflow: hidden;
`;

export const DetailSection = styled.section`
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;

  &:first-of-type {
    border-top: none;
  }
`;

export const DetailTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
`;

export const DetailBlock = styled.div`
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 16px 18px;
  font-size: 14px;
  line-height: 1.5;
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;
