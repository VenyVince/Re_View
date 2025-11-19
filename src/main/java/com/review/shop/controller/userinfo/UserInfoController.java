package com.review.shop.controller.userinfo;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.userinfo.GetUserInfoResponseDTO;
import com.review.shop.dto.userinfo.UpdateUserInfoDTO;
import com.review.shop.service.userinfo.UserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserInfoController {

    private final UserInfoService userInfoService;
    private final Security_Util securityUtil;
    // 회원 정보 조회


    @GetMapping
    public ResponseEntity<?> getInfo() {
        int user_id = securityUtil.getCurrentUserId();   // 사용자 id를 기반으로 유저 아이디 반환(String값(id) 기반으로 Int값(user_id) 반환)
        GetUserInfoResponseDTO userInfo = userInfoService.getUserInfo(user_id); // 유저아이디를 통해서 인포 반환
        return ResponseEntity.ok(userInfo);
    }

    @PatchMapping
    public ResponseEntity<?> updateInfo(@RequestBody UpdateUserInfoDTO updateDTO) {
        int user_id = securityUtil.getCurrentUserId(); // 24번 라인과 깉이 재사용 예시
        userInfoService.updateUserInfo(user_id, updateDTO);
        return ResponseEntity.ok("정보가 수정되었습니다.");
    }

    @DeleteMapping
    public ResponseEntity<?> deleteInfo() {
        int user_id = securityUtil.getCurrentUserId();
        userInfoService.deleteUserInfo(user_id);
        return ResponseEntity.ok("회원 탈퇴 완료");
    }
// 회원 정보 수정 및 회원 탈퇴
}
