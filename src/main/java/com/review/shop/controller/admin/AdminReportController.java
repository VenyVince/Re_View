package com.review.shop.controller.admin;

import com.review.shop.dto.report.ReportResponseDTO;
import com.review.shop.dto.report.ReportStatusDTO;
import com.review.shop.service.report.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
@Tag(name = "Admin Report", description = "관리자용 신고 관리 및 처리 API")
public class AdminReportController {

    private final ReportService reportService;

    // ==================== 신고 목록 조회 ====================
    @Operation(summary = "신고 목록 조회", description = "접수된 신고 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패 (관리자 권한 필요)"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @GetMapping
    public ResponseEntity<List<ReportResponseDTO>> getReports(
            @Parameter(description = "필터링 상태값 (PENDING: 대기중, PROCESSED: 처리됨, REJECTED: 반려됨). 생략 시 전체 조회.")
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(reportService.getReports(status));
    }

    // ==================== 신고 상태 변경 (처리) ====================
    @Operation(summary = "신고 상태 변경", description = "신고를 처리함(PROCESSED) 또는 반려함(REJECTED)으로 상태를 변경합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "상태 변경 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 상태값 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패 (관리자 권한 필요)"),
            @ApiResponse(responseCode = "404", description = "해당 신고 ID를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @PatchMapping("/{report_id}")
    public ResponseEntity<String> updateReportStatus(
            @Parameter(description = "처리할 신고 ID", required = true)
            @PathVariable int report_id,

            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "변경할 상태값 (PROCESSED, REJECTED)", required = true)
            @RequestBody ReportStatusDTO statusDTO
    ) {
        reportService.processReport(report_id, statusDTO.getStatus());
        return ResponseEntity.ok("신고 상태가 변경되었습니다.");
    }
}