import styled from "styled-components";

export const Wrap = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 40px 24px 100px;

  display: flex;
  flex-direction: column;
  align-items: center;

    > * {
        width: 100%;
        max-width: 900px;
    }
`;

export const Title = styled.h1`
  width: 100%;
  max-width: 900px; 
  font-size: 34px;
  font-weight: 800;
  margin: 20px auto 32px;
  text-align: center;
`;

export const Panel = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;

  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);

  overflow: hidden;
`;

export const Row = styled.div`
  display: flex;
  align-items: stretch;
  border-top: 1px solid #eee;
  &:first-child {
    border-top: 0;
  }
`;

export const Cell = styled.div`
  flex: 1;
  padding: 28px 36px; 
`;

export const Label = styled.label`
  display: block;
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 12px;
`;

export const Input = styled.input`
  width: 100%;
  height: 52px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 15px;
  outline: none;
  &:focus {
    border-color: #111;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 160px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  font-size: 15px;
  resize: vertical;
  outline: none;
  &:focus {
    border-color: #111;
  }
`;

export const UploadBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const Thumb = styled.div`
  width: 110px;
  height: 110px;
  border: 1px dashed #d1d5db;
  border-radius: 14px;
  background: #f9fafb;
  color: #9ca3af;
  display: grid;
  place-items: center;
  font-size: 12px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const UploadBtn = styled.button`
  height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #fff;
  cursor: pointer;
  &:hover {
    background: #f3f4f6;
  }
`;

export const Actions = styled.div`
  width: 100%;
  max-width: 1400px; 
  display: flex;
  gap: 14px;
  justify-content: center;
  padding-top: 32px;
  margin: 0 auto;
`;

export const Primary = styled.button`
  height: 46px;
  min-width: 180px;
  border: 0;
  border-radius: 10px;
  background: #111;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Ghost = styled.button`
  height: 46px;
  min-width: 140px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
`;

/* 바우만 타입 선택창 */
export const Select = styled.select`
  width: 100%;
  height: 52px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
    padding: 0 44px 0 10px;
  font-size: 15px;
  outline: none;
  background: #fff;
    
    /* 화살표 이동 */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    
    /* 커스텀 화살표 */
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
    background-repeat: no-repeat;
    background-position: right 16px center;

  &:focus {
    border-color: #111;
  }
    
    /* 텍스트 색 */
    option[value=""]{
        color: #9ca3af;
    }
    &:not([value=""]) {
        color: #374151;
    }
`;