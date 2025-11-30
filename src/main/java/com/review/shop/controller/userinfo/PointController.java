package com.review.shop.controller.userinfo;

import com.review.shop.util.Security_Util;
import com.review.shop.dto.userinfo.user_related.Point.PointResponseDTO;
import com.review.shop.service.userinfo.other.PointService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users/me/points")
@RequiredArgsConstructor
@Tag(name = "Point", description = "포인트 관련 API")
public class PointController {

    private final PointService pointService;
    private final Security_Util security_util;

    // 사용자 포인트 총계(마이페이지에서 포인트 볼 때 바로 조회)

    @Operation(summary = "사용자 총 포인트 조회", description = "현재 로그인한 사용자의 총 포인트를 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "총 포인트 조회 성공"),
            @ApiResponse(responseCode = "401", description = "로그인 필요"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping
    public ResponseEntity<Integer> getUserTotalPoint() {
        int user_id = security_util.getCurrentUserId();
        int totalPoint = pointService.getTotalPoint(user_id);
        return ResponseEntity.ok(totalPoint);
    }


    // 사용자별 포인트 내역 조회(history 보는 용도)
    @Operation(summary = "사용자 포인트 내역 조회", description = "현재 로그인 사용자의 포인트 히스토리를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "사용자 포인트 내역 조회 성공"),
            @ApiResponse(responseCode = "404", description = "해당 사용자의 포인트 내역이 존재하지 않음"),
            @ApiResponse(responseCode = "500", description = "서버 오류: DB 처리 중 오류 발생")
    })
    @GetMapping("/history")
    public ResponseEntity<List<PointResponseDTO>> getPointHistory() {
        int user_id = security_util.getCurrentUserId();
        return ResponseEntity.ok(pointService.getPointHistory(user_id));
    }
}
