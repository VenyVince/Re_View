// src/pages/mypage/user/UserProfileBar.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../../../../api/axiosClient";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../dashboard/UserDashboard.css";

export default function UserProfileBar() {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [nickname, setNickname] = useState(auth.userId || "회원");
    const [points, setPoints] = useState(0);

    useEffect(() => {
        async function fetchMe() {
            try {
                const res = await axiosClient.get("/api/users/me");

                const info = Array.isArray(res.data?.userInfos)
                    ? res.data.userInfos[0]
                    : res.data;

                if (info?.nickname) {
                    setNickname(info.nickname);
                } else if (info?.name) {
                    setNickname(info.name);
                } else if (auth.userId) {
                    setNickname(auth.userId);
                }
                // 포인트 계산 로직 제거됨
            } catch (e) {
                console.error("/api/users/me 조회 실패:", e);
                if (auth.userId) setNickname(auth.userId);
            }
        }

        fetchMe();
    }, [auth.userId]);

    useEffect(() => {
        async function fetchPoint() {
            try {
                const res = await axiosClient.get("/api/users/me/points");

                // 컨트롤러가 Integer 하나만 리턴하므로 그대로 사용
                const totalPoint =
                    typeof res.data === "number" ? res.data : Number(res.data) || 0;

                setPoints(totalPoint);
            } catch (e) {
                console.error("/api/users/me/points 조회 실패:", e);
                setPoints(0);
            }
        }

        fetchPoint();
    }, [auth.userId]);

    return (
        <section className="mypage-profile">
            <div className="mypage-profile-left">
                <div className="mypage-profile-avatar">
                    <span className="avatar-emoji">🙂</span>
                </div>
                <div className="mypage-profile-info">
                    <div className="mypage-profile-name">{nickname} 님</div>
                </div>
            </div>

            <div className="mypage-profile-right">
                <div
                    className="mypage-profile-point"
                    onClick={() => navigate("/mypage/points")}
                >
                    <span className="label">보유 포인트 </span>
                    <span className="value">
                        {points.toLocaleString()}{""}
                        <span className="unit">원</span>
                    </span>
                </div>
                <button
                    className="mypage-profile-edit-btn"
                    onClick={() => navigate("/mypage/profile")}
                >
                    개인정보변경
                </button>
            </div>
        </section>
    );
}