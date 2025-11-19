package com.review.shop.controller.qna;

import com.review.shop.dto.qna.QnaDTO;
import com.review.shop.service.qna.QnaService;
import com.review.shop.service.userinfo.UserInfoService;
import io.swagger.v3.oas.annotations.Operation; // Swagger 있다면 사용
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "QnA API", description = "상품 문의 게시판")
@RestController
@RequestMapping("/api/qna")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QnaController {

    private final QnaService qnaService;
    private final UserInfoService userInfoService;

    // 목록 조회
    @Operation(summary = "QnA 목록 조회")
    @GetMapping("/list/{productId}")
    public ResponseEntity<List<QnaDTO>> getQnaList(@PathVariable int productId) {
        return ResponseEntity.ok(qnaService.getQnaList(productId));
    }

    // 상세 조회
    @Operation(summary = "QnA 상세 조회")
    @GetMapping("/{qnaId}")
    public ResponseEntity<QnaDTO> getQnaDetail(@PathVariable int qnaId) {
        return ResponseEntity.ok(qnaService.getQnaDetail(qnaId));
    }

    // 등록 (로그인 필수)
    @Operation(summary = "질문 등록")
    @PostMapping
    public ResponseEntity<String> createQna(
            @RequestBody QnaDTO qnaDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");

        // 로그인 ID -> DB PK(int) 변환
        int userPk = userInfoService.getUser_id(userDetails.getUsername());
        qnaDTO.setUser_id(userPk);

        qnaService.registerQna(qnaDTO);
        return ResponseEntity.ok("등록 성공");
    }

    // 수정 (로그인 필수 + 본인 확인)
    @Operation(summary = "질문 수정")
    @PutMapping
    public ResponseEntity<String> updateQna(
            @RequestBody QnaDTO qnaDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");

        int userPk = userInfoService.getUser_id(userDetails.getUsername());
        // 프론트에서 보낸 user_id를 무시하고, 실제 로그인한 사람의 ID를 덮어씌움 (보안)
        qnaDTO.setUser_id(userPk);

        qnaService.modifyQna(qnaDTO);
        return ResponseEntity.ok("수정 성공");

    }

    // 삭제 (로그인 필수 + 본인 확인)
    @Operation(summary = "질문 삭제")
    @DeleteMapping("/{qnaId}")
    public ResponseEntity<String> deleteQna(
            @PathVariable int qnaId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");

        int userPk = userInfoService.getUser_id(userDetails.getUsername());

        qnaService.removeQna(qnaId, userPk);
        return ResponseEntity.ok("삭제 성공");

    }
}