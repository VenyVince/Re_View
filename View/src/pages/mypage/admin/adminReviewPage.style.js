import styled from "styled-components";

export const Wrap = styled.div`
  width: 100%;
  padding: 20px 40px;
`;

export const Inner = styled.div`
  width: 100%;
`;

export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
`;

export const Card = styled.div`
  position: relative;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #ddd;
  overflow: hidden;
`;

export const Badge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: black;
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
`;

export const Thumb = styled.div`
  width: 100%;
  height: 180px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CardBody = styled.div`
  padding: 15px;
`;

export const Reviewer = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

export const ContentText = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
`;

export const Price = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;

  button {
    font-size: 18px;
    background: none;
    border: none;
    cursor: pointer;
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  align-items: center;
  gap: 20px;
`;

export const PagerBtn = styled.button`
  background: #eee;
  border-radius: 6px;
  padding: 8px 12px;
  border: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.2;
    cursor: default;
  }
`;

export const PageInfo = styled.div`
  font-size: 16px;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalBox = styled.div`
  background: white;
  padding: 40px 50px;
  border-radius: 12px;
  text-align: center;

  h2 {
    margin-bottom: 30px;
    font-size: 24px;
  }
`;

export const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;

  button {
    padding: 10px 30px;
    font-size: 16px;
    border-radius: 8px;
    border: 1px solid black;
    cursor: pointer;
  }

  button:last-child {
    background: black;
    color: white;
  }
`;
