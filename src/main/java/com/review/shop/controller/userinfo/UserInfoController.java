package com.review.shop.controller.userinfo;

import com.review.shop.dto.login.UserInfoDto;
import com.review.shop.dto.userinfo.UserInfoResponseDTO;
import com.review.shop.dto.userinfo.UserInfoUpdateDTO;
import com.review.shop.service.userinfo.UserInfoService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserInfoController {
    private final UserInfoService userInfoService;

    // 회원 정보 조회
    @GetMapping
    public ResponseEntity<UserInfoResponseDTO> getMyInfo(HttpSession session) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // 로그인 ID
        UserInfoDto user = userService.getUserById(username); // DB에서 user_id 가져오기
        int user_id = user.getUserId();
        // 로그인 시 세션에 저장된 ID
        UserInfoResponseDTO user = userInfoService.getUserInfo(user_id);
        return ResponseEntity.ok(user);
    }

    // 회원 정보 수정
    @PatchMapping
    public ResponseEntity<String> updateMyInfo(HttpSession session, @RequestBody UserInfoUpdateDTO updateDTO) {
        int user_id = (int) session.getAttribute("user_id");
        userInfoService.updateUserInfo(user_id, updateDTO);
        return ResponseEntity.ok("회원 정보 수정이 완료되었습니다.");
    }

    // 회원 탈퇴
    @DeleteMapping
    public ResponseEntity<String> deleteMyAccount(HttpSession session) {
        int user_id = (int) session.getAttribute("user_id");
        userInfoService.deleteUser(user_id);
        session.invalidate(); // 세션 삭제
        return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
    }
}
