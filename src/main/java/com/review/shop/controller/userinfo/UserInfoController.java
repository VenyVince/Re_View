package com.review.shop.controller.userinfo;

import com.review.shop.dto.login.UserInfoDto;
import com.review.shop.dto.userinfo.UserInfoResponseDTO;
import com.review.shop.dto.userinfo.UserInfoUpdateDTO;
import com.review.shop.service.userinfo.UserInfoService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserInfoController {

    private final UserInfoService userInfoService;

    // 회원 정보 조회
    @GetMapping
    public ResponseEntity<?> getMyInfo(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 정보가 없습니다.");
        }

        String id = userDetails.getUsername(); // 로그인한 사용자의 아이디 반환
        UserInfoResponseDTO userinfo = userInfoService.getUserInfo()
        UserInfoResponseDTO userInfo = userInfoService.getUserInfoByid(id); // 이메일로 user_id 조회 후 정보 반환

        return ResponseEntity.ok(userInfo);
    }

//    // 회원 정보 수정
//    @PatchMapping
//    public ResponseEntity<String> updateMyInfo(@AuthenticationPrincipal UserDetails userDetails,
//                                               @RequestBody UserInfoUpdateDTO updateDTO) {
//        if (userDetails == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 정보가 없습니다.");
//        }
//
//        String email = userDetails.getUsername();
//        int userId = userInfoService.getUserIdByEmail(id); // 이메일로 user_id 조회
//        userInfoService.updateUserInfoByEmail(userId, updateDTO);
//
//        return ResponseEntity.ok("회원 정보 수정이 완료되었습니다.");
//    }
//
//    // 회원 탈퇴
//    @DeleteMapping
//    public ResponseEntity<String> deleteMyAccount(@AuthenticationPrincipal UserDetails userDetails) {
//        if (userDetails == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 정보가 없습니다.");
//        }
//
//        String email = userDetails.getUsername();
//        int userId = userInfoService.getUserIdByEmail(email);
//        userInfoService.deleteUserByEmail(userId);
//
//        return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
//    }
}
