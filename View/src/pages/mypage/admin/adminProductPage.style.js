import styled from "styled-components";

export const Wrap = styled.div`
  background:#fafafa;
  min-height: calc(100vh - 120px); /* 헤더/푸터 공간 감안 */
`;
export const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 48px;
`;
export const Layout = styled.div`
  display:grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
`;

export const Sidebar = styled.aside`
  background:#fff;
  border:1px solid #eee;
  border-radius:12px;
  padding:12px;
`;
export const SideItem = styled.div`
  display:flex; align-items:center; gap:8px;
  padding:10px 12px; border-radius:10px; cursor:pointer;
  font-weight:600; color:#111;
  background:${p=>p.$active ? "#f1f5f9" : "transparent"};
  &:hover{ background:#f6f8fb; }
  & + & { margin-top:4px; }
`;

export const Content = styled.section``;

export const TitleRow = styled.div`
  display:flex; justify-content:space-between; align-items:center;
  margin-bottom:12px;
`;
export const Title = styled.h2`
  font-size:28px; font-weight:800;
`;
export const AddButton = styled.button`
  padding:8px 12px; border:1px solid #111; border-radius:10px;
  background:#111; color:#fff; font-weight:700; cursor:pointer;
`;

export const Grid = styled.div`
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  @media (max-width: 992px){
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px){
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background:#fff; border:1px solid #eee; border-radius:12px; overflow:hidden;
  position:relative;
`;
export const Badge = styled.span`
  position:absolute; top:10px; left:10px;
  font-size:12px; background:#f1f5f9; border-radius:6px; padding:4px 6px; font-weight:700;
`;
export const Thumb = styled.div`
  height:160px; background:#efefef; display:flex; align-items:center; justify-content:center; color:#777;
`;
export const CardBody = styled.div`
  padding:12px;
`;
export const Name = styled.div`
  font-weight:700; margin-bottom:6px;
`;
export const Price = styled.div`
  font-weight:700; margin-bottom:6px;
`;
export const Actions = styled.div`
  display:flex; gap:10px;
  & > button{
    background:#fff; border:1px solid #e5e7eb; border-radius:8px; padding:4px 8px; cursor:pointer;
  }
`;

export const Pagination = styled.div`
  display:flex; align-items:center; justify-content:center; gap:12px; margin-top:22px;
`;
export const PagerBtn = styled.button`
  width:36px; height:32px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; cursor:pointer;
  &:disabled{ opacity:.5; cursor:default; }
`;
export const PageInfo = styled.span`
  font-weight:600; color:#444;
`;
