package com.review.shop.controller;

//회원가입, 로그인, 로그아웃 등의 기능을 담당하는 컨트롤러

import com.review.shop.dto.login.LoginRequestDto;
import com.review.shop.dto.login.UserInfoDto;
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

        //user_id 조회
        UserInfoDto user = userService.getUserByLoginId(loginDto.getId());

        //세션 저장, JessionID 자동 생성
        HttpSession session = request.getSession(true);

        session.setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                SecurityContextHolder.getContext()
        );

        //user_id를 세션에 저장
        session.setAttribute("userId", user.getUser_id());

        return ResponseEntity.ok("로그인 성공");
    }
}
