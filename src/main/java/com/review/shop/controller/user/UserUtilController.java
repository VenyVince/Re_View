package com.review.shop.controller.user;

//아이디 중복 확인, 아이디 찾기, 임시 비밀번호 발송 등의 부가 기능을 담당하는 컨트롤러

import com.review.shop.dto.user.TemPasswordDTO;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.service.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Tag(name = "User Utility", description = "회원 부가 기능 API")
@RestController
@RequiredArgsConstructor
public class UserUtilController {
    private final UserService userService;


    @Operation(summary = "아이디 중복 확인")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "확인할 아이디", required = true,
            content = @Content(schema = @Schema(type = "object", example = "{\"id\": \"testuser123\"}"))
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "사용 가능한 아이디 (메시지 문자열 반환)"),
            @ApiResponse(responseCode = "400", description = "백엔드 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PostMapping("/api/auth/check-id")
    public ResponseEntity<String> checkDuplicateId(@RequestBody Map<String, String> payload) {
        boolean isDuplicate = userService.isDuplicateId(payload.get("id"));

        if (isDuplicate) {
            throw new WrongRequestException("이미 사용 중인 아이디입니다.");
        } else {
            return ResponseEntity
                    .ok("사용 가능한 아이디입니다.");
        }
    }

    @Operation (summary = "임시 비밀번호 발송")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "임시 비밀번호 발송 성공 (메시지 문자열 반환)"),
            @ApiResponse(responseCode = "400", description = "백엔드 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PostMapping("/api/auth/send-temp-password")
    public ResponseEntity<String> sendTemporaryPassword(@RequestBody TemPasswordDTO temPasswordDTO) {
        String id = temPasswordDTO.getId();
        String email = temPasswordDTO.getEmail();

        userService.processTempPasswordEmail(id, email);
        return ResponseEntity.ok("임시 비밀번호가 이메일로 발송되었습니다.");
    }


    @Operation (summary = "아이디 찾기")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "아이디 찾기 성공 (메시지 문자열 반환)"),
            @ApiResponse(responseCode = "400", description = "백엔드 오류",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "404", description = "아이디를 찾을 수 없음.",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/api/auth/find-id")
    public ResponseEntity<String> findId(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String phoneNumber = payload.get("phone_number");
        String foundId = userService.findIdByNameAndPhoneNumber(name, phoneNumber);
        return ResponseEntity.ok("찾으신 아이디는: " + foundId + " 입니다.");
    }
}