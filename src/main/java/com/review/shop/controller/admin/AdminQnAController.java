package com.review.shop.controller.admin;

import com.review.shop.dto.qna.QnAListDTO;
import com.review.shop.dto.qna.QnaDTO;
import com.review.shop.service.admin.AdminQnAService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@Tag(name = "Admin API", description = "QnA 관련 관리자 기능 API")
@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminQnAController {

    private final AdminQnAService adminQnAService;

    @Operation(summary = "전체 QnA 목록 조회 (어드민용)", description = "어드민 페이지에서 사용할 전체 QnA 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "QnA 목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = QnAListDTO.class))
                    )
            ),
            @ApiResponse(responseCode = "400", description = "백엔드 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/qna")
    public ResponseEntity<?> getAllQna() {
        return ResponseEntity.ok(adminQnAService.getAllQna());

    }

    @Operation(summary = "QnA 상세 조회", description = "특정 QnA 게시글의 상세 내용을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "QnA 상세 조회 성공",
                    content = @Content(schema = @Schema(implementation = QnaDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "백엔드 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/qna/{qna_id}")
    public ResponseEntity<?> getQnaDetail(
            @Parameter(description = "조회할 QnA의 ID") @PathVariable int qna_id ){
        return ResponseEntity.ok(adminQnAService.getQnaDetail(qna_id));
    }

    @Operation(summary = "QnA 답변 등록/수정", description = "QnA 게시글에 관리자 답변을 등록하거나 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "답변 등록 성공"),
            @ApiResponse(responseCode = "400", description = "백엔드 오류")
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PatchMapping("/qna/{qna_id}/answer")
    public ResponseEntity<String> updateQnaAnswer(
            @Parameter(description = "답변할 QnA의 ID") @PathVariable int qna_id,
            @RequestBody @Schema(example = "{\"adminAnswer\": \"답변 내용\"}") Map<String, String> payload) {
        adminQnAService.updateQnaAnswer(qna_id, payload.get("adminAnswer"));
        return ResponseEntity.ok("QnA 답변이 등록되었습니다");
    }
}
