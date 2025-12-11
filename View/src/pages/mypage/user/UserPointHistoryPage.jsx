import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import UserMyPageLayout from "./layout/UserMyPageLayout";
import "./UserPointHistoryPage.css";

export default function UserPointHistoryPage() {
    const [totalPoint, setTotalPoint] = useState(0);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const formatPrice = (v) =>
        v?.toLocaleString("ko-KR", { maximumFractionDigits: 0 }) ?? "0";

    const formatDateTime = (iso) => {
        if (!iso) return "";
        // "YYYY-MM-DD HH:mm" 정도로만 표시
        return iso.replace("T", " ").slice(0, 16);
    };

    useEffect(() => {
        async function fetchPointData() {
            try {
                setLoading(true);
                setError("");

                // 1) 총 포인트
                const totalRes = await axiosClient.get("/api/users/me/points");
                const total =
                    typeof totalRes.data === "number"
                        ? totalRes.data
                        : Number(totalRes.data) || 0;
                setTotalPoint(total);

                // 2) 포인트 히스토리
                const historyRes = await axiosClient.get(
                    "/api/users/me/points/history"
                );

                const list = Array.isArray(historyRes.data)
                    ? historyRes.data
                    : [];

                setHistory(list);
            } catch (e) {
                console.error("/api/users/me/points/history 조회 실패:", e);
                setError(
                    "포인트 사용 내역을 불러오는 중 오류가 발생했습니다."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchPointData();
    }, []);

    return (
        <UserMyPageLayout>
            <section className="mypage-section point-history-section">
                <h3 className="mypage-section-title">포인트 내역</h3>

                <div className="point-history-summary">
                    <div className="point-history-total-label">현재 보유 포인트</div>
                    <div className="point-history-total-value">
                        {formatPrice(totalPoint)}P
                    </div>
                    <div className="point-history-summary-desc">
                        적립 및 사용 내역을 확인할 수 있어요.
                    </div>
                </div>

                {loading && (
                    <p className="point-history-message">
                        포인트 내역을 불러오는 중입니다...
                    </p>
                )}
                {error && (
                    <p className="point-history-message point-history-error">
                        {error}
                    </p>
                )}

                {!loading && !error && history.length === 0 && (
                    <p className="point-history-message">
                        아직 포인트 내역이 없습니다.
                    </p>
                )}

                {!loading && !error && history.length > 0 && (
                    <div className="point-history-table-wrapper">
                        <table className="point-history-table">
                            <thead>
                            <tr>
                                <th>일시</th>
                                <th>내용</th>
                                <th>변경 포인트</th>
                            </tr>
                            </thead>
                            <tbody>
                            {history.map((item) => {
                                // PointResponseDTO 기반 필드 매핑
                                const id = item.point_history_id;

                                const createdAt = item.created_at || "";

                                // type: 'use' (사용), 'earn' (보상/적립)
                                const type = String(item.type || "").toLowerCase();
                                const isUse = type === "use";

                                // amount: Integer, 항상 절대값으로 사용하고, +/- 는 type 으로만 결정
                                const numericAmount = Math.abs(
                                    Number(item.amount) || 0
                                );

                                const desc =
                                    item.description ||
                                    (isUse ? "포인트 사용" : "포인트 적립");

                                // PointResponseDTO 에는 적용 후 포인트(balance)가 없으므로,
                                // 이 컬럼은 현재는 표시하지 않고 '-' 로 대체
                                // const afterBalance = null;

                                return (
                                    <tr key={id}>
                                        <td>{formatDateTime(createdAt)}</td>
                                        <td>{desc}</td>
                                        <td
                                            className={
                                                "ph-amount " +
                                                (isUse
                                                    ? "ph-amount-use"
                                                    : "ph-amount-earn")
                                            }
                                        >
                                            {isUse ? "-" : "+"}
                                            {formatPrice(numericAmount)}
                                            P
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </UserMyPageLayout>
    );
}