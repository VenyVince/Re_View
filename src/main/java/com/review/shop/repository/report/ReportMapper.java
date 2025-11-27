package com.review.shop.repository.report;

import com.review.shop.dto.report.ReportResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReportMapper {

    // 신고 목록 조회
    List<ReportResponseDTO> selectReports(@Param("status") String status);

    // 신고 상태 변경
    int updateReportStatus(
            @Param("report_id") int report_id,
            @Param("status") String status
    );
}