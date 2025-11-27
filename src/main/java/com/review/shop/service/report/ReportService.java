package com.review.shop.service.report;

import com.review.shop.dto.report.ReportResponseDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.report.ReportMapper;
import com.review.shop.repository.review.ProductReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportMapper reportMapper;
    private final ProductReviewMapper productReviewMapper;

    // 신고 목록 조회
    @Transactional(readOnly = true)
    public List<ReportResponseDTO> getReports(String status) {
        try {
            return reportMapper.selectReports(status);
        } catch (DataAccessException e) {
            throw new DatabaseException("신고 목록 조회 중 오류가 발생했습니다.", e);
        }
    }

    // 신고 처리 (상태 변경)
    @Transactional
    public void processReport(int report_id, String newStatus) {
        if (!"PROCESSED".equals(newStatus) && !"REJECTED".equals(newStatus) && !"PENDING".equals(newStatus)) {
            throw new WrongRequestException("잘못된 상태값입니다.");
        }

        try {
            int result = reportMapper.updateReportStatus(report_id, newStatus);
            if (result == 0) {
                throw new ResourceNotFoundException("존재하지 않는 신고 ID입니다.");
            }

        } catch (DataAccessException e) {
            throw new DatabaseException("신고 처리 중 DB 오류가 발생했습니다.", e);
        }
    }
}