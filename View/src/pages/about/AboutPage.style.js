// src/pages/about/AboutPage.style.js
import styled from "styled-components";

export const Wrap = styled.div`
    min-height: 100vh;
    background: radial-gradient(circle at top, #fef3c7 0, #ffffff 40%, #f9fafb 100%);
    padding: 80px 24px 120px;
    font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui,
    sans-serif;
    font-size: 20px;
`;

export const Inner = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

export const Hero = styled.section`
    max-width: 960px;
    margin: 0 auto 40px;
    padding: 40px 32px 48px;
    border-radius: 28px;

    /* ★ 기본은 완전 흰색 */
    background: #ffffff;
    color: #1f2937;

    /* ★ 부드러운 그림자 */
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.3s ease-out, transform 0.3s ease-out;

    /* ★ hover 시 살짝 떠오르는 느낌 */
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 28px 55px rgba(0, 0, 0, 0.1);
    }

    /* ★ hover될 때만 은은한 그라데이션 등장 */
    &::before {
        content: "";
        position: absolute;
        inset: 0;
        opacity: 0;
        background: radial-gradient(
                circle at 30% 20%,
                rgba(254, 243, 199, 0.6),
                rgba(255, 255, 255, 0.1) 60%
        );
        transition: opacity 0.4s ease-out;
        pointer-events: none;
    }

    &:hover::before {
        opacity: 1;   /* hover에서만 그라데이션 ON */
    }
`;

export const HeroBadge = styled.div`
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 999px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 14px;
    background: #f3f4f6;    
    color: #374151;         
`;

export const HeroTitle = styled.h1`
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 12px;
    position: relative;
    z-index: 1;
    color: #111827; /* ★ 메인 텍스트 컬러 밝게 */

    span {
        display: inline-block;
        margin-top: 4px;
        font-size: 30px;
        background: linear-gradient(120deg, #f59e0b, #ef4444);
        -webkit-background-clip: text;
        color: transparent;
    }
`;

export const HeroSubtitle = styled.p`
    font-size: 14px;
    line-height: 1.8;
    color: #4b5563;  
    margin-bottom: 18px;
    position: relative;
    z-index: 1;
`;

export const HeroTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
    justify-content: center;
  position: relative;
  z-index: 1;
`;

export const HeroTag = styled.span`
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 999px;
    background: #f3f4f6; 
    border: 1px solid #e5e7eb;
    color: #374151;
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
  font-size: 22px;
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
    transition: transform 0.18s ease-out, box-shadow 0.18s ease-out, background 0.18s ease-out;
    cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

    ${({ $clickable }) =>
            $clickable &&
            `
    &:hover {
      background: #ffffff;
      box-shadow: 0 10px 25px rgba(15,23,42,0.08);
      transform: translateY(-2px);
    }
  `}
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
    margin: 30px auto 0;
    border-left: 1px solid #e5e7eb;
    
    max-width: 900px;
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
    left: -6px;
    top: 4px;
    width: 12px;
    height: 12px;
    border-radius: 999px;
    background: #111827;
`;

export const TimelineContent = styled.div`
    h4 {
        font-size: 17px;      
        font-weight: 700;
        margin-bottom: 6px;
        color: #111827;
    }

    p {
        font-size: 15px;    
        color: #4b5563;
        line-height: 1.8;    
    }
`;

// 설문 상세 영역
export const SurveyDetail = styled.div`
    margin-top: 18px;
    border-radius: 18px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);

    /* ★ 애니메이션용 */
    overflow: hidden;
    max-height: ${({ $open }) => ($open ? "9999px" : "0px")};
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    padding: ${({ $open }) => ($open ? "20px 22px 24px" : "0 22px 0")};
    transition:
            max-height 0.5s ease,
            opacity 0.35s ease,
            padding 0.4s ease;
`;

export const SurveyDetailTitle = styled.h3`
  font-size: 24px;
  font-weight: 900;
  margin-bottom: 16px;
`;

export const SurveyGroup = styled.div`
  & + & {
    margin-top: 20px;
    padding-top: 14px;
    border-top: 1px dashed #e5e7eb;
  }
`;

export const SurveyGroupTitle = styled.h4`
  font-size: 20px;
  font-weight: 700;
    margin: 22px 0 10px;
    text-align: center;
`;

export const SurveyQuestionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const SurveyQuestionItem = styled.li`
    padding: 10px 0;

    .q-text {
        font-size: 17px;
        font-weight: 550;
        line-height: 1.9;
        margin-bottom: 8px;
    }

    .q-options {
        list-style: none;
        padding: 0;
        margin: 0;
        font-size: 14px;
        line-height: 1.8;
        color: #4b5563;
    }

    .q-options li {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 3px;
    }

    .opt-label {
        flex: 1;
    }

    /* 🔻 여기부터가 포인트 */
    .opt-side {
        font-weight: 600;
        font-size: 12px;
        color: #6b7280;

        opacity: 0;              /* 기본은 안 보이게 */
        transition: opacity 0.2s ease;
    }

    /* 옵션 한 줄에 마우스 올렸을 때만 사이드(D/O/S/R) 보이게 */
    .q-options li:hover .opt-side {
        opacity: 1;
    }
`;
