// src/pages/mypage/admin/adminProductEdit.style.js
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

  background: #fafafa;
`;

export const Inner = styled.div`
  width: 100%;
`;

export const Title = styled.h1`
  width: 100%;
  max-width: 900px;
  font-size: 34px;
  font-weight: 800;
  margin: 20px auto 32px;
  text-align: center;
`;

// 등록 페이지 Panel 스타일 그대로
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

// 등록 Row + Cell 구조를 Row 하나로 흡수
export const Row = styled.div`
  display: flex;
  align-items: stretch;
  border-top: 1px solid #eee;

  &:first-child {
    border-top: 0;
  }

  padding: 28px 36px;
  gap: 24px;
`;

// 좌측 굵은 라벨 → 등록 스타일에 맞게 약간 줄임
export const Label = styled.div`
  width: 180px;
  font-size: 15px;
  color: #6b7280;
  font-weight: 600;
  display: flex;
  align-items: center;
`;

// 입력 영역
export const Input = styled.input`
  flex: 1;
  height: 52px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 15px;
  outline: none;
  background: #fff;

  &:focus {
    border-color: #111;
  }
`;

export const TextArea = styled.textarea`
  flex: 1;
  min-height: 160px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  font-size: 15px;
  resize: vertical;
  outline: none;
  background: #fff;

  &:focus {
    border-color: #111;
  }
`;

// 이미지 업로드 박스 (등록 UploadBox + Thumb 느낌)
export const ImageBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;

  .thumb {
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
  }

  input[type="file"] {
    display: none;
  }
`;

// 버튼 스타일 등록 UploadBtn이랑 같게
export const UploadBtn = styled.label`
  height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #fff;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #f3f4f6;
  }
`;

// 하단 버튼 줄 → 등록 Actions 느낌
export const FooterRow = styled.div`
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: center;
  padding-top: 32px;
  margin: 0 auto;
`;

export const SubmitBtn = styled.button`
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

export const Helper = styled.div`
  text-align: center;
  margin-top: 6px;
  font-size: 13px;
  color: #9ca3af;
`;

export const Select = styled.select`
  flex: 1;
  height: 52px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0 48px 0 16px;
  font-size: 15px;
  background-color: #fff;
  cursor: pointer;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
  background-repeat: no-repeat;
  background-position: right 16px center;

  &:focus {
    border-color: #111;
  }

  option[value=""] {
    color: #9ca3af;
  }
`;
