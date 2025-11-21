package com.review.shop.controller.admin;

import com.review.shop.dto.qna.QnAListDTO;
import com.review.shop.dto.qna.QnaDTO;
import com.review.shop.dto.user.UserSummaryDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.service.admin.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Admin API", description = "회원 관련 관리자 기능 API")
@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminMemberCotroller {


    private final AdminService adminService;

    @Operation(summary = "전체 QnA 목록 조회 (어드민용)", description = "어드민 페이지에서 사용할 전체 QnA 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "QnA 목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = QnAListDTO.class))
                    )
            ),
            @ApiResponse(responseCode = "400", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/qna")
    public ResponseEntity<?> getAllQna() {
        return ResponseEntity.ok(adminService.getAllQna());

    }

    @Operation(summary = "QnA 상세 조회", description = "특정 QnA 게시글의 상세 내용을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "QnA 상세 조회 성공",
                    content = @Content(schema = @Schema(implementation = QnaDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/qna/{qna_id}")
    public ResponseEntity<?> getQnaDetail(
            @Parameter(description = "조회할 QnA의 ID") @PathVariable int qna_id ){
        return ResponseEntity.ok(adminService.getQnaDetail(qna_id));
    }

    @Operation(summary = "QnA 답변 등록/수정", description = "QnA 게시글에 관리자 답변을 등록하거나 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "답변 등록 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PatchMapping("/qna/{qna_id}/answer")
    public ResponseEntity<String> updateQnaAnswer(
            @Parameter(description = "답변할 QnA의 ID") @PathVariable int qna_id,
            @RequestBody @Schema(example = "{\"adminAnswer\": \"답변 내용\"}") Map<String, String> payload) {
        adminService.updateQnaAnswer(qna_id, payload.get("adminAnswer"));
        return ResponseEntity.ok("QnA 답변이 등록되었습니다");
    }

    @Operation(summary = "회원 포인트 조회", description = "특정 회원의 보유 포인트를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "포인트 조회 성공",
                    content = @Content(schema = @Schema(example = "{\"points\": 1500}"))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/users/{user_id}/points")
    public ResponseEntity<Map<String, Integer>> getMemberPoints(
            @Parameter(description = "조회할 회원의 ID") @PathVariable int user_id) {
        return ResponseEntity.ok(Map.of("points", adminService.getMemberPoints(user_id)));
    }

    //디버깅용 유저 포인트 업데이트
    @Operation(summary = "회원 포인트 업데이트 (디버깅용)", description = "특정 회원의 포인트를 업데이트합니다. (디버깅용)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "포인트 업데이트 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 또는 DB 오류")
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PatchMapping("/users/{user_id}/points")
    public ResponseEntity<String> updateMemberPoints(
            @Parameter(description = "포인트를 업데이트할 회원의 ID") @PathVariable int
                    user_id,
            @RequestBody @Schema(example = "{\"points\": 2000}") Map<String, Integer> payload) {
        Integer points = payload.get("points");
        if (points == null || points < 0) {
            throw new WrongRequestException("포인트는 0 이상의 정수여야 합니다.");
        }
        adminService.updateMemberPoints(user_id, points);
        return ResponseEntity.ok("회원 포인트가 업데이트되었습니다");
    }

    @Operation(summary = "전체 회원 목록 조회", description = "모든 회원의 요약 정보를 조회합니다.")
    @GetMapping("/users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "회원 목록 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = UserSummaryDTO.class))
                    )
            ),
            @ApiResponse(responseCode = "400", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<List<UserSummaryDTO>> getAllMembers() {
        List<UserSummaryDTO> userList = adminService.getAllusers();

        return ResponseEntity.ok(userList);
    }

    // 회원 밴 및 기록
    @Operation(summary = "회원 밴", description = "특정 회원을 밴 및 밴기록을 설정합니다.")
    @PostMapping("/users/{user_id}/ban")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "밴 설정 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<String> setBlacklist(
            @Parameter(description = "밴할 회원 ID", required = true)
            @PathVariable int user_id,

            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "밴 사유 정보",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    example = "{\"reason\": \"악성 유저 / 욕설 사용\"}"
                            )
                    )
            )
            @RequestBody Map<String, String> payload) {

        String reason = payload.get("reason");
        if (reason == null || reason.isEmpty()) {
            throw new WrongRequestException("reason 값이 필요합니다.");
        }

        adminService.blockAndExpelUser(user_id, reason);

        return ResponseEntity.ok("회원이 강퇴되었습니다.");
    }

    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity<String> handleDatabase(DatabaseException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(WrongRequestException.class)
    public ResponseEntity<String> handleWrongRequest(WrongRequestException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
