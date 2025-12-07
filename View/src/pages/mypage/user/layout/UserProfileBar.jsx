// src/pages/mypage/user/UserProfileBar.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";   // ✅ 추가
import "../dashboard/UserDashboard.css";

export default function UserProfileBar() {
    const { auth } = useAuth();
    const navigate = useNavigate();              // ✅ 추가

    const [nickname, setNickname] = useState(auth.userId || "회원");
    const [points, setPoints] = useState(0);

    useEffect(() => {
        async function fetchMe() {
            try {
                const res = await axios.get("/api/users/me", {
                    withCredentials: true,
                });

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

                // 포인트: null / 문자열까지 모두 처리
                const rawPoint =
                    info?.point ?? info?.points ?? info?.point_balance ?? 0;

                const numericPoint = Number(rawPoint);
                setPoints(Number.isNaN(numericPoint) ? 0 : numericPoint);
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
                    onClick={() => navigate("/mypage/profile")}   // ✅ 여기만 변경
                >
                    개인정보변경
                </button>
            </div>
        </section>
    );
}