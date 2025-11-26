import React from "react";
import styled from "styled-components";
import logo from "../../../assets/logo.png";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
    return (
        <FooterWrap>
            <Logo src={logo} alt="Re:View 로고" />

            <Sub>피부 타입 테스트와 사용자 후기를 기반으로 뷰티 상품 페이지</Sub>

            <LinkNav aria-label="푸터 링크">
                <StyledLink to="/terms">이용약관</StyledLink>
                <Separator aria-hidden="true">|</Separator>
                <StyledLink to="/privacy">개인정보처리방침</StyledLink>
                <Separator aria-hidden="true">|</Separator>
                <StyledLink to="/faq">FAQ·도움말</StyledLink>
                <Separator aria-hidden="true">|</Separator>
                <StyledLink to="/ads">광고 제휴 문의</StyledLink>
            </LinkNav>
        </FooterWrap>
    );
}

const FooterWrap = styled.footer`
    width: 100%;
    padding: 56px 16px 64px;
    background: #e1e1e1;
    color: #252525;
    text-align: center;
    border-top: 1px solid #eee;
`;
const Logo = styled.img`
    width: 140px; height: auto; margin: 0 auto; display: block;
`;
const Sub = styled.p`
    margin: 12px auto 28px; font-size: 15px; color: #8a8a8a;
`;
const LinkNav = styled.nav`
    display: flex; justify-content: center; flex-wrap: wrap;
    gap: 10px 32px; font-size: 14px;
    a { color: #4a4a4a; text-decoration: none; }
    a:hover { text-decoration: underline; }
`;

const StyledLink = styled(RouterLink)`
  color: #4a4a4a;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;
const Separator = styled.span``;