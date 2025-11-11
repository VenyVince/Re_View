import styled from "styled-components";

export const Wrap = styled.div`
  width: 100%;
`;

export const Section = styled.section`
  padding: 80px 20px 120px;
  background: #fff;
`;

export const Grid = styled.div`
  max-width: 1100px;
  margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Title = styled.h1`
  font-size: 44px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 14px;
`;

export const Sub = styled.p`
  color: #666;
  font-size: 16px;
`;

export const Right = styled.div`
  width: 100%;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
    width: 100%;
    align-items: stretch;
`;

export const Label = styled.label`
  font-weight: 600;
    text-align: left;
    width: 100%;
`;

export const Input = styled.input`
    width: 100%;
  height: 44px;
  border-radius: 10px;
  border: 1px solid #eee;
  padding: 0 14px;
  outline: none;
  font-size: 15px;
    
    
  &:focus {
    border-color: #111;
  }
`;

export const Textarea = styled.textarea`
    width: 100%;
    min-height: 120px;
  border-radius: 10px;
  border: 1px solid #eee;
  padding: 12px 14px;
  outline: none;
  font-size: 15px;
  resize: vertical;

  &:focus {
    border-color: #111;
  }
`;

export const ErrorText = styled.span`
  color: #d33;
  font-size: 13px;
`;

export const SubmitBtn = styled.button`
  margin-top: 6px;
  height: 48px;
  border-radius: 12px;
  border: none;
  background: #000;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.06s ease, opacity 0.2s ease;

  &:hover { opacity: 0.9; }
  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export const SentMsg = styled.div`
  background: #f7f7f7;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 28px;
  text-align: center;
  font-weight: 600;
`;
