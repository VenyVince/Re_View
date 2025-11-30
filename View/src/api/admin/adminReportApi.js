import axiosClient from "../axiosClient";

// 신고 목록 조회
export const fetchReports = async (status) => {
    const res = await axiosClient.get("/api/admin/reports", {
        params: status ? { status } : {}
    });
    return res.data;
};

// 신고 상태 변경
export const updateReportStatus = async (reportId, status) => {
    const res = await axiosClient.patch(`/api/admin/reports/${reportId}`, {
        status: status // "PROCESSED" or "REJECTED"
    });
    return res.data;
};
