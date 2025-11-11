import styled from 'styled-components';

export const Wrap = styled.main`
  background:#fff;
`;
export const Hero = styled.section`
  width:100%;
  background:#6f6f6f;
  color:#fff;
`;
export const HeroInner = styled.div`
  max-width:1100px; margin:0 auto; padding:56px 20px;
`;
export const HeroTitle = styled.h1`
  font-size:36px; font-weight:700; letter-spacing:-0.3px;
`;
export const Container = styled.div`
  max-width:1100px; margin:24px auto 120px; padding:0 20px;
`;
export const Card = styled.article`
    background:#fff;
    border:1px solid #e6e6e6;
    border-radius:8px;
    padding:28px 28px 36px;
    box-shadow:0 1px 2px rgba(0,0,0,0.04);
    text-align: left;
`;

export const H2 = styled.h2`
  font-size:22px; font-weight:700; margin-bottom:18px;
`;
export const H3 = styled.h3`
  font-size:16px; font-weight:700; margin:22px 0 8px;
`;
export const P = styled.p`
  font-size:14px; line-height:1.8; color:#333;
`;
export const Ol = styled.ol`
  margin:8px 0 0 18px; padding-left:0; font-size:14px; line-height:1.8; color:#333;
  & > li { margin:2px 0; }
`;

export const Section = styled.section`
  & + & { margin-top:16px; }
`;

export const Ul = styled.ul`
  margin:8px 0 0 24px; /* 기존보다 살짝 더 들여쓰기 */
  padding-left:16px;  
  list-style-type: disc; 
  font-size:14px;
  line-height:1.8;
  color:#333;

  & > li {
    margin:2px 0;
  }

  /* 중첩 리스트 더 들여쓰기 */
  ul {
    margin-top:4px;
    margin-left:20px;
    list-style-type: disc; 
  }
`;