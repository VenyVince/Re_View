// src/pages/mypage/admin/AdminLayout.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";

const LayoutWrap = styled.div`
  display: flex;
  width: 100%;
  min-height: 600px;
`;

const Sidebar = styled.aside`
  width: 220px;
  padding: 20px;
  background: #f7f7f7;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SideLink = styled(NavLink)`
  display: block;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  text-decoration: none;
  color: #222;

  &.active {
    background: #000;
    color: #fff;
  }
`;

const ContentArea = styled.section`
  flex: 1;
  padding: 30px 40px;
  background: #fff;
`;

function AdminLayout() {
    return (
        <LayoutWrap>
            <Sidebar>
                {/* ✅ /admin 기준 상대경로 (App.js 라우트랑 맞춤) */}
                <SideLink to="allproducts">상품 등록/수정/삭제</SideLink>
                <SideLink to="reviews">리뷰 관리</SideLink>
                <SideLink to="report">신고 관리</SideLink>
                <SideLink to="qna">Q&A 관리</SideLink>
                <SideLink to="users">유저 관리</SideLink>
            </Sidebar>

            <ContentArea>
                {/* ✅ 중첩 라우트가 여기 렌더됨 */}
                <Outlet />
            </ContentArea>
        </LayoutWrap>
    );
}

export default AdminLayout;
