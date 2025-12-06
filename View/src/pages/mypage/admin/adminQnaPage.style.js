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

/* 회원관리와 동일한 TitleRow */
export const TitleRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  height: 40px;
`;

export const CenterTitle = styled.h2`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  font-weight: 800;
`;

export const BackButton = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #f3f4f6;
  }
`;

/* 목록 리스트 */
export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
`;

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid #eee;
`;

export const Row = styled.li`
  display: flex;
  align-items: center;
  padding: 16px 4px;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

export const IconCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: ${({ status }) =>
    status === "답변완료" ? "#22c55e" : "#f87171"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  margin-right: 16px;
`;

export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

export const QuestionText = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

export const Meta = styled.div`
    font-size: 13px;
    color: #555;
    margin-bottom: 3px;
    line-height: 1.4;
`;

/* 페이징 */
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

/* 상세 페이지 */
export const QuestionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 16px 0 24px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
`;

export const QuestionContent = styled.div`
  white-space: pre-wrap;
  font-size: 15px;
  color: #444;
  margin-top: 16px;
  margin-bottom: 24px;
  line-height: 1.6;
`;

export const AnswerBox = styled.div`
  border-radius: 18px;
  border: 1px solid #d1d5db;
  background: #fff;
  padding: 24px 24px 32px;
`;

export const AnswerTitleInput = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  padding: 14px 16px;
  font-size: 15px;
  outline: none;

  &::placeholder {
    color: #9ca3af;
  }
`;

export const AnswerTextarea = styled.textarea`
  width: 100%;
  border: none;
  padding: 16px;
  font-size: 15px;
  outline: none;
  resize: none;
  min-height: 260px;

  &::placeholder {
    color: #9ca3af;
  }
`;

export const AnswerButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

export const AnswerButton = styled.button`
  min-width: 160px;
  padding: 10px 28px;
  border-radius: 999px;
  border: 1px solid #000;
  background: #000;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 800;
`;

export const QnaTable = styled.table`
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

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

export const FilterSelect = styled.select`
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
`;

export const SearchInput = styled.input`
  margin-left: auto;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  min-width: 220px;
`;

export const FilterLabel = styled.span`
  font-size: 14px;
  color: #555;
`;
