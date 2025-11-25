// src/pages/mypage/user/UserProfileBar.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";
import "../dashboard/UserDashboard.css";

// 마이페이지 상단 프로필

export default function UserProfileBar() {
    const { auth } = useAuth();
    const [nickname, setNickname] = useState(auth.userId || "회원");
    const [points, setPoints] = useState(0); // 포인트 있으면 채워 쓰기

    useEffect(() => {
        async function fetchMe() {
            try {
                const res = await axios.get("/api/users/me", {
                    withCredentials: true,
                });

                console.log("✅ /api/users/me 응답:", res);

                // 응답 구조가 { userInfos: [...] } 라고 했으니까
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

                if (typeof info?.point === "number") {
                    setPoints(info.point);
                }
            } catch (e) {
                console.error("/api/users/me 조회 실패:", e);
                if (auth.userId) setNickname(auth.userId);
            }
        }

        fetchMe();
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
                <div className="mypage-profile-point">
                    <span className="label">보유 포인트</span>
                    <span className="value">
                        {points.toLocaleString()} <span className="unit">원</span>
                    </span>
                </div>
                <button
                    className="mypage-profile-edit-btn"
                    onClick={() => (window.location.href = "/mypage/profile")}
                >
                    개인정보변경
                </button>
            </div>
        </section>
    );
}