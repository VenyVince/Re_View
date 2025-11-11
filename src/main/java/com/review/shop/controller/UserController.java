package com.review.shop.controller;

//회원가입, 로그인, 로그아웃 등의 기능을 담당하는 컨트롤러

import com.review.shop.dto.login.LoginRequestDto;
import com.review.shop.dto.login.UserInfoDTO;
import com.review.shop.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
// Controller에서 Service의 예외처리를 위임 받음
public class UserController  {
    UserService userService;
    private final AuthenticationManager authenticationManager;

    // 회원가입 로직 구현
    @PostMapping("/api/auth/register")
    // 전달받은 파라미터로 DTO 생성, 회원가입 서비스 호출
    public ResponseEntity<String> registerUser(@RequestBody UserInfoDTO userDTO) {

        userService.registerUser(userDTO);

        return ResponseEntity
                .status(HttpStatus.CREATED).body("회원가입이 완료되었습니다.");
    }

    // 로그인 로직 구현
    // 기존엔 SecurityConfig로 인증처리를 했으나, Restful API 방식이므로 수동으로 인증처리
    // 사용자의 ID/PW를 받아 토큰으로 생성하고, 해당 토큰을 UserDetails 비교하여 인증 수행
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
}
