package com.review.shop.controller.userinfo;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.userinfo.userinfo.GetUserInfoResponseDTO;
import com.review.shop.dto.userinfo.userinfo.UpdateUserInfoDTO;
import com.review.shop.service.userinfo.UserInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
@Tag(name = "User Info", description = "사용자 정보 조회/수정/삭제 API")
public class UserInfoController {

    private final UserInfoService userInfoService;
    private final Security_Util securityUtil;


    // 회원 정보 조회
    @Operation(summary = "회원 정보 조회", description = "현재 로그인한 사용자의 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "사용자 정보를 찾을 수 없음 (ResourceNotFoundException)"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    @GetMapping
    public ResponseEntity<?> getInfo() {
        int user_id = securityUtil.getCurrentUserId();   // 사용자 id를 기반으로 유저 아이디 반환(String값(id) 기반으로 Int값(user_id) 반환)
        GetUserInfoResponseDTO userInfo = userInfoService.getUserInfo(user_id); // 유저아이디를 통해서 인포 반환
        return ResponseEntity.ok(userInfo);
    }

    @Operation(summary = "회원 정보 수정", description = "현재 로그인한 사용자의 정보를 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    @PatchMapping
    public ResponseEntity<?> updateInfo(
            @Parameter(description = "수정할 사용자 정보")
            @RequestBody UpdateUserInfoDTO updateDTO) {
        int user_id = securityUtil.getCurrentUserId(); // 24번 라인과 깉이 재사용 예시
        userInfoService.updateUserInfo(user_id, updateDTO);
        return ResponseEntity.ok("정보가 수정되었습니다.");
    }


    @Operation(summary = "회원 탈퇴", description = "현재 로그인한 사용자의 계정을 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "탈퇴 성공"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    @DeleteMapping
    public ResponseEntity<?> deleteInfo() {
        int user_id = securityUtil.getCurrentUserId();
        userInfoService.deleteUserInfo(user_id);
        return ResponseEntity.ok("회원 탈퇴 완료");
    }
// 회원 정보 수정 및 회원 탈퇴
}
