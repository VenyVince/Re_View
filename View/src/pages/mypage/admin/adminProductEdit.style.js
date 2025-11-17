import styled from "styled-components";

export const Wrap = styled.div`
  background: #fafafa;
  min-height: calc(100vh - 120px);
`;

export const Inner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 32px 16px 60px;
`;

export const Title = styled.h1`
  font-size: 40px;
  font-weight: 900;
  letter-spacing: -0.5px;
  margin: 0 0 24px;
`;

export const Panel = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  overflow: hidden;
`;

export const Row = styled.div`
  border-top: 1px solid #e5e7eb;
  &:first-child { border-top: 0; }
  display: flex;
  align-items: center;
  min-height: 96px;
  padding: 18px 22px;
`;

export const Label = styled.div`
  width: 260px;
  font-weight: 800;
  font-size: 20px;
`;

export const Input = styled.input`
  flex: 1;
  height: 54px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 0 16px;
  outline: none;
`;

export const TextArea = styled.textarea`
  flex: 1;
  min-height: 110px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 14px 16px;
  outline: none;
  resize: vertical;
`;

export const ImageBox = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  & .thumb {
    width: 84px;
    height: 84px;
    border-radius: 16px;
    background: #efefef;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8b8b8b;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  & input[type="file"] {
    display: none;
  }
`;

export const UploadBtn = styled.label`
  display: inline-block;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
`;

export const SubmitBtn = styled.button`
  min-width: 220px;
  height: 48px;
  border-radius: 12px;
  border: 0;
  background: #111;
  color: #fff;
  font-weight: 900;
  cursor: pointer;
`;

export const Helper = styled.div`
  color: #6b7280;
  font-size: 14px;
  margin-top: 6px;
`;
