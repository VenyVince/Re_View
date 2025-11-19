package com.review.shop.controller.qna;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.qna.QnaDTO;
import com.review.shop.service.qna.QnaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/qna")
@RequiredArgsConstructor
public class QnaController {

    private final QnaService qnaService;
    private final Security_Util securityUtil;

    @Operation(summary = "QnA 목록 조회", description = "특정 상품의 문의 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @GetMapping("/list/{productId}")
    public ResponseEntity<List<QnaDTO>> getQnaList(@PathVariable int productId) {
        return ResponseEntity.ok(qnaService.getQnaList(productId));
    }

    @Operation(summary = "QnA 상세 조회", description = "문의글 ID로 상세 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @GetMapping("/{qnaId}")
    public ResponseEntity<QnaDTO> getQnaDetail(@PathVariable int qnaId) {
        return ResponseEntity.ok(qnaService.getQnaDetail(qnaId));
    }

    @Operation(summary = "질문 등록", description = "로그인한 사용자가 새 문의글을 등록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "등록 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패 (로그인 필요)"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @PostMapping
    public ResponseEntity<String> createQna(
            @RequestBody QnaDTO qnaDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");

        // 로그인 ID -> DB PK(int) 변환
        int userPk = securityUtil.getCurrentUserId();
        qnaDTO.setUser_id(userPk);

        qnaService.registerQna(qnaDTO);
        return ResponseEntity.ok("등록 성공");
    }

    @Operation(summary = "질문 수정", description = "본인이 작성한 문의글을 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패 (로그인 필요)"),
            @ApiResponse(responseCode = "404", description = "수정 권한 없음 또는 글 없음"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @PutMapping
    public ResponseEntity<String> updateQna(
            @RequestBody QnaDTO qnaDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");

        int userPk = securityUtil.getCurrentUserId();
        // 프론트에서 보낸 user_id를 무시하고, 실제 로그인한 사람의 ID를 덮어씌움 (보안)
        qnaDTO.setUser_id(userPk);

        qnaService.modifyQna(qnaDTO);
        return ResponseEntity.ok("수정 성공");

    }

    @Operation(summary = "질문 삭제", description = "본인이 작성한 문의글을 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패 (로그인 필요)"),
            @ApiResponse(responseCode = "404", description = "삭제 권한 없음 또는 글 없음"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @DeleteMapping("/{qnaId}")
    public ResponseEntity<String> deleteQna(
            @PathVariable int qnaId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");

        int userPk = securityUtil.getCurrentUserId();;

        qnaService.removeQna(qnaId, userPk);
        return ResponseEntity.ok("삭제 성공");

    }
}