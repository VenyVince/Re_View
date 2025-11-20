// src/pages/about/AboutPage.style.js
import styled from "styled-components";

export const Wrap = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top, #fef3c7 0, #ffffff 40%, #f9fafb 100%);
  padding: 80px 24px 120px;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui,
    sans-serif;
`;

export const Inner = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

export const Hero = styled.section`
  max-width: 960px;
  margin: 0 auto 40px;
  padding: 32px 28px 40px;
  border-radius: 24px;
  background: linear-gradient(135deg, #111827, #1f2937 55%, #4b5563);
  color: #f9fafb;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.35);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 0 0, rgba(251, 191, 36, 0.3), transparent 55%);
    pointer-events: none;
  }
`;

export const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid rgba(249, 250, 251, 0.2);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 14px;
  background: rgba(15, 23, 42, 0.6);
`;

export const HeroTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;

  span {
    display: inline-block;
    margin-top: 4px;
    font-size: 30px;
    background: linear-gradient(120deg, #facc15, #f97316);
    -webkit-background-clip: text;
    color: transparent;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: #e5e7eb;
  margin-bottom: 18px;
  position: relative;
  z-index: 1;
`;

export const HeroTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
  z-index: 1;
`;

export const HeroTag = styled.span`
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(249, 250, 251, 0.08);
  border: 1px solid rgba(249, 250, 251, 0.15);
`;

// 공통 하이라이트
export const Highlight = styled.span`
  font-weight: 600;
  color: #111827;
  background: #fef9c3;
  padding: 0 4px;
  border-radius: 4px;
`;

// 섹션: 스크롤 애니메이션용
export const Section = styled.section`
  padding: 28px 6px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? "0" : "30px")});
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
`;

export const SectionDesc = styled.p`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.8;

  strong {
    font-weight: 600;
  }
`;

// 카드 그리드
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 8px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  padding: 18px 16px 20px;
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 35px rgba(15, 23, 42, 0.12);
  }
`;

export const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: #111827;
  color: #ffffff;
  font-size: 12px;
  margin-bottom: 10px;
`;

export const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
`;

export const CardText = styled.p`
  font-size: 13px;
  color: #4b5563;
  line-height: 1.6;
`;

// 숫자 통계
export const StatRow = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 8px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const StatItem = styled.div`
  flex: 1;
  border-radius: 18px;
  border: 1px dashed #e5e7eb;
  padding: 16px 16px 18px;
  background: #f9fafb;
`;

export const StatNumber = styled.div`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
`;

// 타임라인
export const Timeline = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
  border-left: 1px solid #e5e7eb;
`;

export const TimelineItem = styled.li`
  position: relative;
  padding-left: 18px;
  padding-bottom: 18px;

  &:last-child {
    padding-bottom: 0;
  }
`;

export const TimelineDot = styled.span`
  position: absolute;
  left: -5px;
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #111827;
`;

export const TimelineContent = styled.div`
  h4 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  p {
    font-size: 13px;
    color: #4b5563;
    line-height: 1.6;
  }
`;
