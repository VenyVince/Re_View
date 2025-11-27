// src/pages/mypage/user/UserProfileEdit.jsx
import React, { useEffect, useState } from "react";
import "../layout/UserProfileEdit.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserProfileEdit() {
    const navigate = useNavigate();

    // 폼 값 상태
    const [nickname, setNickname] = useState("");  //  /api/users/me 와 연동
    const [phone, setPhone] = useState("");        //  phoneNumber 와 연동

    const [oldPassword, setOldPassword] = useState(""); //  /api/auth/reset-password 에 currentPassword
    const [newPassword, setNewPassword] = useState(""); //  /api/auth/reset-password 에 newPassword

    // UI 상태
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 처음 들어올 때 내 정보 불러오기
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await axios.get("/api/users/me", {
                    withCredentials: true,
                });
                console.log("GET /api/users/me 응답:", res.data);

                // 응답 구조: { userInfos: [ {...} ] } 또는 { ... } 둘 다 방어
                const user = res.data?.userInfos?.[0] ?? res.data;
                if (!user) return;

                // name 은 아직 스키마에 없으니 그대로 둠 (폼만)
                if (user.nickname !== undefined) {
                    setNickname(user.nickname ?? "");
                }
                const phoneFromServer =
                    user.phoneNumber ?? user.phone_number ?? "";
                setPhone(phoneFromServer);
            } catch (e) {
                console.error("내 정보 조회 실패:", e);
                setError("내 정보를 불러오지 못했습니다.");
            }
        };

        fetchMe();
    }, []);

    // 저장 버튼
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // 1️⃣ 비밀번호 변경이 필요한지 체크
            const wantsChangePassword = oldPassword || newPassword;

            if (wantsChangePassword) {
                // 둘 중 하나만 입력한 경우
                if (!oldPassword || !newPassword) {
                    setError("비밀번호를 변경하려면 현재 비밀번호와 새 비밀번호를 모두 입력해주세요.");
                    setLoading(false);
                    return;
                }

                // ✅ 비밀번호 변경 API 호출
                await axios.post(
                    "/api/auth/reset-password",
                    {
                        currentPassword: oldPassword,
                        newPassword: newPassword,
                    },
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );
            }

            // 2️⃣ 닉네임 / 전화번호 PATCH (/api/users/me)
            const body = {
                nickname,
                phoneNumber: phone,
                // baumann_id 는 사용 안함
            };

            await axios.patch("/api/users/me", body, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            alert("개인정보가 수정되었습니다.");
            navigate("/mypage");
        } catch (e) {
            console.error("내 정보 수정 실패:", e);

            // reset-password, users/me 둘 다 여기로 들어옴
            if (e.response) {
                const status = e.response.status;
                if (status === 400) {
                    // 비밀번호 틀림, 잘못된 값 등
                    setError(
                        e.response.data?.message ||
                        "요청이 잘못되었거나 수정할 수 없는 값입니다."
                    );
                } else if (status === 401) {
                    setError("로그인이 만료되었습니다. 다시 로그인해주세요.");
                    navigate("/login");
                } else {
                    setError("정보 수정 중 서버 오류가 발생했습니다.");
                }
            } else if (e.request) {
                setError("서버와 연결할 수 없습니다. 네트워크를 확인해주세요.");
            } else {
                setError("정보 수정 중 알 수 없는 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/mypage");
    };

    return (
        <div className="mypage-edit-wrapper">
            <div className="mypage-edit-shell">
                <h2 className="mypage-edit-title">개인정보 변경</h2>

                {/* 자동완성 끄기 */}
                <form
                    className="mypage-edit-form"
                    onSubmit={handleSubmit}
                    autoComplete="off"
                >
                    {/* 크롬/구글 자동완성 꼬임 방지용 더미 인풋 */}
                    <input
                        type="text"
                        name="fake-username"
                        autoComplete="username"
                        style={{ display: "none" }}
                    />
                    <input
                        type="password"
                        name="fake-password"
                        autoComplete="new-password"
                        style={{ display: "none" }}
                    />



                    <div className="mypage-edit-group">
                        <label>닉네임</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            disabled={loading}
                            autoComplete="off"
                        />
                    </div>

                    <div className="mypage-edit-group">
                        <label>전화번호</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="010-1234-5678"
                            disabled={loading}
                            autoComplete="off"
                        />
                    </div>

                    <hr className="mypage-edit-divider" />

                    <div className="mypage-edit-group">
                        <label>현재 비밀번호</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="비밀번호 변경 시에만 입력"
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="mypage-edit-group">
                        <label>새 비밀번호</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="비밀번호 변경 시에만 입력"
                            disabled={loading}
                            autoComplete="new-password"
                        />
                    </div>

                    {error && <p className="mypage-edit-error">{error}</p>}

                    <div className="mypage-edit-buttons">
                        <button
                            type="button"
                            className="mypage-edit-btn secondary"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="mypage-edit-btn primary"
                            disabled={loading}
                        >
                            {loading ? "저장 중..." : "저장하기"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}