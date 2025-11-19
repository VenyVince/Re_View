package com.review.shop.controller.qna;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.qna.QnaDTO;
import com.review.shop.service.qna.QnaService;
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

    // 목록 조회
    @GetMapping("/list/{productId}")
    public ResponseEntity<List<QnaDTO>> getQnaList(@PathVariable int productId) {
        return ResponseEntity.ok(qnaService.getQnaList(productId));
    }

    // 상세 조회
    @GetMapping("/{qnaId}")
    public ResponseEntity<QnaDTO> getQnaDetail(@PathVariable int qnaId) {
        return ResponseEntity.ok(qnaService.getQnaDetail(qnaId));
    }

    // 등록 (로그인 필수)
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

    // 수정 (로그인 필수 + 본인 확인)
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

    // 삭제 (로그인 필수 + 본인 확인)
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