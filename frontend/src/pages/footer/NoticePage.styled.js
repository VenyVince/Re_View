import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Wrap = styled.main`
  background:#fff;
`;

export const Hero = styled.section`
  width:100%;
  background:#fff; /* 스샷처럼 흰 배경 히어로 */
  color:#111;
  border-bottom:1px solid #eee;
`;

export const HeroInner = styled.div`
  max-width:1100px; margin:0 auto; padding:72px 20px 48px;
`;

export const HeroTitle = styled.h1`
  font-size:48px; font-weight:800; letter-spacing:-0.5px;
  margin:0 0 12px;
`;

export const HeroSub = styled.p`
  font-size:16px; color:#666; margin:0;
`;

export const Container = styled.div`
  max-width:1100px; margin:32px auto 120px; padding:0 20px;
`;

export const List = styled.div`
  display:flex; flex-direction:column; gap:28px;
`;

export const Item = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: #fff;
    border: 1px solid #ececec;
    border-radius: 8px;
    padding: 28px 32px;
    text-decoration: none;
    transition: box-shadow .2s ease, transform .2s ease, border-color .2s ease;

    &:hover { border-color:#ddd; box-shadow:0 1px 4px rgba(0,0,0,0.05); transform: translateY(-2px);
`;


export const Body = styled.div`
  display:flex; flex-direction:column; gap:6px;
  min-width:0; /* 텍스트 줄바꿈 안정화 */
`;

export const Title = styled.h3`
  font-size:20px; font-weight:700; color:#111; margin:0;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
`;

export const Excerpt = styled.p`
  margin:0; color:#555; font-size:14px; line-height:1.6;
  overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
`;

export const Meta = styled.span`
  font-size:12px; color:#9a9a9a;
`;


export const DetailWrap = styled.article`
  max-width: 800px;
  margin: 0 auto 80px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 6px rgba(0,0,0,.05);
  padding: 28px 32px;
`;

export const DetailHeader = styled.header`
  border-bottom: 1px solid #eee;
  padding-bottom: 14px;
  margin-bottom: 18px;
`;

export const DetailTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 6px;
`;

export const DetailMeta = styled.div`
  color: #888;
  font-size: 0.9rem;
`;

export const DetailContent = styled.section`
  line-height: 1.7;
  color: #333;
  p + p { margin-top: 10px; }
`;

export const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 22px;
  text-decoration: none;
  color: #111;
  font-weight: 600;
  &:hover { text-decoration: underline; }
`;

