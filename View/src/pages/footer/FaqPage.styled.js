import styled from 'styled-components';

export const Wrap = styled.div`
    width: 100%;
    padding-bottom: 80px;
`;

export const Hero = styled.section`
    background: #fff;
    text-align: center;
    padding: 100px 20px 60px;
`;

export const HeroInner = styled.div`
    max-width: 800px;
    margin: 0 auto;
`;

export const HeroTitle = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 10px;
`;

export const HeroSub = styled.p`
    color: #555;
    font-size: 1rem;
`;

export const Container = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
`;

export const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const Item = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;   /* 가운데 정렬 */
    justify-content: center;
    text-align: center;
    background: #fff;
    border-radius: 12px;
    padding: 28px 32px;
    box-shadow: 0 0 6px rgba(0,0,0,0.05);
`;

export const Body = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 680px;
`;

export const Title = styled.h3`
    font-size: 1.2rem;
    font-weight: 600;
`;

export const Excerpt = styled.p`
    color: #666;
    font-size: 0.95rem;
    line-height: 1.6;
`;
