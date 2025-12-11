import styled from "styled-components";

export const Wrap = styled.div`
  background: #fafafa;
  min-height: calc(100vh - 120px);
`;

export const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 48px;
`;

export const Content = styled.section`
  background: #fff;
  border-radius: 16px;
  padding: 24px 24px 32px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 800;
`;

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
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
  min-width: 240px;
`;

export const TableWrapper = styled.div`
  border-radius: 12px;
  border: 1px solid #eee;
  overflow: hidden;
  background: #fff;
`;

export const UserTable = styled.table`
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
`;

export const EmptyState = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #777;
  font-size: 14px;
`;

export const SmallButton = styled.button`
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #fff;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:hover {
    background-color: #f1f3f5;
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
    opacity: 0.4;
    cursor: default;
  }
`;

export const PageInfo = styled.span`
  font-weight: 600;
  color: #444;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const ModalBox = styled.div`
  background: white;
  padding: 32px 36px;
  border-radius: 12px;
  text-align: center;
  min-width: 360px;

  h2 {
    margin-bottom: 22px;
    font-size: 18px;
    font-weight: 700;
  }
`;

export const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;

  button {
    padding: 8px 18px;
    font-size: 14px;
    border-radius: 999px;
    border: 1px solid #111;
    cursor: pointer;
    background: #fff;
  }

  button:last-child {
    background: #111;
    color: #fff;
  }
`;
