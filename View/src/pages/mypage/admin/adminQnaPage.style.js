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

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 12px;
`;

export const SectionTitle = styled.h2`
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
  background: #f97373;
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
`;

export const QuestionText = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const Meta = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

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

/* ---------- 답변 작성 페이지 ---------- */

export const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0 24px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
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
