package com.review.shop.controller.user;

//회원가입, 로그인, 로그아웃 등의 기능을 담당하는 컨트롤러

import com.review.shop.dto.user.LoginRequestDto;
import com.review.shop.dto.user.PasswordUpdateDto;
import com.review.shop.dto.user.UserInfoDto;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.service.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@AllArgsConstructor

public class UserController  {
    UserService userService;
    private final AuthenticationManager authenticationManager;

    // 회원가입 로직 구현 (테스트 완료)
    @PostMapping("/api/auth/register")
    public ResponseEntity<String> registerUser(@RequestBody UserInfoDto userDTO) {

        userService.registerUser(userDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED).body("회원가입이 완료되었습니다.");
    }

    //아이디 중복 확인 (테스트 완료)
    @PostMapping("/api/auth/check-id")
    public ResponseEntity<String> checkDuplicateId(@RequestBody Map<String, String> payload) {
        boolean isDuplicate = userService.isDuplicateId(payload.get("id"));

        if (isDuplicate) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("이미 사용 중인 아이디입니다.");
        } else {
            return ResponseEntity
                    .ok("사용 가능한 아이디입니다.");
        }
    }

    // 로그인 로직 구현 (테스트 완료)
    @PostMapping("/api/auth/login")
    public ResponseEntity<String> login(
            @RequestBody LoginRequestDto loginDto,
            HttpServletRequest request
    ) {

        // ID/PW로 인증 토큰 생성
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(loginDto.getId(), loginDto.getPassword());

        // 해당 토큰을 활용하여 authentication 수행
        Authentication authentication = authenticationManager.authenticate(token);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        //세션 저장, JessionID 자동 생성
        HttpSession session = request.getSession(true);
        session.setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                SecurityContextHolder.getContext()
        );
        return ResponseEntity.ok("로그인 성공");
    }

    // 비밀번호 재설정 로직 구현 (테스트 완료)
    //passwordUpdateDto는 기존 비밀번호, 새 비밀번호를 포함
    @PostMapping("/api/auth/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordUpdateDto passwordUpdateDto, @AuthenticationPrincipal UserDetails userDetails) {
        userService.resetPassword(passwordUpdateDto, userDetails);

        return ResponseEntity.ok("비밀번호가 재설정되었습니다.");
    }


    //디버깅용, 추후에 삭제 예정
    @GetMapping("/api/auth/me")
    public ResponseEntity<?> getMyInfo(@AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails != null) {
            String id = userDetails.getUsername();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            String password = userDetails.getPassword();

            Map<String, String> userInfo = new HashMap<>();
            userInfo.put("id", id);
            userInfo.put("role", role);
            //userDetails에서 password를 가져오면 null로 지워버림 (보안상 이유)
            userInfo.put("password", password);

            return ResponseEntity.ok(userInfo);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 정보가 없습니다.");
        }
    }

    //회원가입 예외처리 핸들러
    @ExceptionHandler(WrongRequestException.class)
    public ResponseEntity<String> handleWrongRequest(WrongRequestException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

}
