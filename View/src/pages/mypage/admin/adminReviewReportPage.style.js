// src/pages/mypage/admin/adminReviewReportPage.style.js
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

export const Content = styled.section`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 24px 32px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
`;

/* 제목 영역 */
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

/* 필터 / 검색 */
export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
`;

export const FilterLabel = styled.span`
  font-size: 14px;
  color: #555;
`;

export const FilterSelect = styled.select`
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  background: #fff;
`;

export const SearchInput = styled.input`
  margin-left: auto;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  min-width: 220px;
`;

/* 테이블 */
export const TableWrapper = styled.div`
  border-radius: 12px;
  border: 1px solid #eee;
  overflow: hidden;
  background: #fff;
`;

export const ReportTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  thead {
    background-color: #f8f9fb;
  }

  th,
  td {
    padding: 10px 12px;
    border-bottom: 1px solid #eee;
    text-align: left;
    vertical-align: middle;
  }

  th {
    font-weight: 600;
    color: #333;
  }

  tbody tr:hover {
    background-color: #fafafa;
  }

  .ellipsis {
    max-width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const EmptyState = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #777;
  font-size: 14px;
`;

/* 상태 뱃지 */
export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
    /* 배경색 */
    background-color: ${(props) =>
            props.status === "PENDING"
                    ? "#fff4e5"       // 대기 = 주황톤 배경
                    : props.status === "PROCESSED"
                            ? "#ffe3e3"       // 처리 = 빨강톤 배경
                            : "#f1f3f5"};     // 반려됨 = 회색톤 배경

    /* 글자 색 */
    color: ${(props) =>
            props.status === "PENDING"
                    ? "#f08c00"       // 대기 = 주황
                    : props.status === "PROCESSED"
                            ? "#fa5252"       // 처리됨 = 빨강
                            : "#495057"};     // 반려됨 = 진한 회색
`;

/* 버튼 */
export const SmallButton = styled.button`
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #f1f3f5;
  }
`;

/* 페이지네이션 */
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


/* 모달 배경 */
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

/* 모달 박스 */
export const ModalBox = styled.div`
  background: #fff;
  padding: 24px 28px;
  border-radius: 16px;
  min-width: 420px;
  max-width: 520px;
  max-height: 80vh;
  overflow-y: auto;
`;

/* 모달 제목 */
export const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
`;

/* 모달 구간 제목 */
export const ModalSectionTitle = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
`;

/* 모달 내용 박스 */
export const ModalBoxContent = styled.div`
  font-size: 14px;
  line-height: 1.5;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f8f9fb;
  border: 1px solid #e5e7eb;
  margin-bottom: 16px;
`;

/* 신고자/작성자 정보 */
export const ModalText = styled.p`
  font-size: 14px;
  margin-bottom: 10px;
`;

/* 모달 버튼 영역 */
export const ModalButtonRow = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

/* 처리완료 버튼 */
export const ModalPrimaryButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  background: #495057;
  color: white;
  border: none;
  cursor: pointer;

    &:hover {
        background: #343a40;
    }
`;

/* 반려 버튼 */
export const ModalSecondaryButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #ddd;
  cursor: pointer;
`;
