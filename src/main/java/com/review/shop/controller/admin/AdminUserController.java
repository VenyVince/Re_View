package com.review.shop.controller.admin;

import com.review.shop.dto.user.UserSummaryDTO;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.service.admin.AdminUserService;
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

import java.util.List;
import java.util.Map;

@Tag(name = "Admin API", description = "회원 관련 관리자 기능 API")
@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
public class AdminUserController {


    private final AdminUserService adminUserService;



    @Operation(summary = "회원 포인트 조회", description = "특정 회원의 보유 포인트를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "포인트 조회 성공",
                    content = @Content(schema = @Schema(example = "{\"points\": 1500}"))),
            @ApiResponse(responseCode = "400", description = "백엔드 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/users/{user_id}/points")
    public ResponseEntity<Map<String, Integer>> getMemberPoints(
            @Parameter(description = "조회할 회원의 ID") @PathVariable int user_id) {
        return ResponseEntity.ok(Map.of("points", adminUserService.getMemberPoints(user_id)));
    }

    //디버깅용 유저 포인트 업데이트
    @Operation(summary = "회원 포인트 업데이트 (디버깅용)", description = "특정 회원의 포인트를 업데이트합니다. (디버깅용)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "포인트 업데이트 성공"),
            @ApiResponse(responseCode = "400", description = "백엔드 오류")
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
        adminUserService.updateMemberPoints(user_id, points);
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
            @ApiResponse(responseCode = "400", description = "백엔드 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
            ,
            @ApiResponse(responseCode = "500", description = "DB 조회 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<List<UserSummaryDTO>> getAllMembers() {
        List<UserSummaryDTO> userList = adminUserService.getAllusers();

        return ResponseEntity.ok(userList);
    }

    // 회원 밴 및 기록
    @Operation(summary = "회원 밴", description = "특정 회원을 밴 및 밴기록을 설정합니다.")
    @PostMapping("/users/{user_id}/ban")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "밴 설정 성공"),
            @ApiResponse(responseCode = "400", description = "백엔드 오류")
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

        adminUserService.blockAndExpelUser(user_id, reason);

        return ResponseEntity.ok("회원이 강퇴되었습니다.");
    }
}
