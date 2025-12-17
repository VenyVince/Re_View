import { useState } from "react";
import "./ReviewReportModal.css";

export default function ReviewReportModal({ onClose, onSubmit }) {
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        if (!reason) {
            alert("신고 사유를 선택해주세요.");
            return;
        }

        onSubmit({
            reason,
            description,
        });
    };

    return (
        <div className="report-modal-backdrop" onClick={onClose}>
            <div
                className="report-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <h3>리뷰 신고</h3>

                <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                >
                    <option value="">사유 선택</option>
                    <option value="욕설">욕설</option>
                    <option value="광고">광고</option>
                    <option value="허위 정보">허위 정보</option>
                    <option value="기타">기타</option>
                </select>

                <textarea
                    placeholder="상세 내용을 입력해주세요 (선택)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="report-actions">
                    <button className="btn-danger" onClick={handleSubmit}>
                        신고
                    </button>
                    <button className="btn-cancel" onClick={onClose}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}
