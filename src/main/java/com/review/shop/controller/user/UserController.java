package com.review.shop.controller.user;

//회원가입, 로그인, 로그아웃 등의 핵심 인증 기능을 담당하는 컨트롤러

import com.review.shop.dto.user.LoginRequestDTO;
import com.review.shop.dto.user.PasswordUpdateDTO;
import com.review.shop.dto.user.UserInfoDTO;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.service.user.UserService;
import com.review.shop.util.Security_Util;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "User Authentication", description = "회원 인증 API")
@RestController
@RequiredArgsConstructor
public class UserController  {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final Security_Util security_util;

    @Operation(summary = "회원 가입")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "회원가입 성공 (메시지 문자열 반환)"),
            @ApiResponse(responseCode = "400", description = "백엔드 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PostMapping("/api/auth/register")
    public ResponseEntity<String> registerUser(@RequestBody UserInfoDTO userDTO) {

        String type = userDTO.getBaumann_id();

        Integer Baumann_int = userService.changeBaumannTypeToInt(type);
        userDTO.setBaumann_id(String.valueOf(Baumann_int));

        userService.registerUser(userDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED).body("회원가입이 완료되었습니다.");
    }


    @Operation(summary = "로그인")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그인 성공 (JSON 객체 반환)",
                    content = @Content(schema = @Schema(type = "object", example = "{\"message\": \"로그인 성공\", \"user_id\": \"testuser123\"}"))),
            @ApiResponse(responseCode = "400", description = "백엔드 오류",
                    content = @Content(schema = @Schema(implementation = String.class))),

            @ApiResponse (responseCode = "401", description = "밴 당한 사용자 로그인 시도",
                    content = @Content(schema = @Schema(type = "object", example = "{\"message\": \"밴 당한 사용자입니다. 관리자에게 문의하세요.\"}")))
    })
    @PostMapping("/api/auth/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody LoginRequestDTO loginDto,
            @Parameter(hidden = true)
            HttpServletRequest request
    ) {
        UserInfoDTO userInfoDTO = userService.getUserByLoginId(loginDto.getId());
        int user_id = userInfoDTO.getUser_id();
        String encodedPassword = userInfoDTO.getPassword();

        // true면 밴리스트에 존재
        boolean isBanned = userService.isUserBanned(user_id);
        if (isBanned) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "밴 당한 사용자입니다. 관리자에게 문의하세요."));
        }

        if (!passwordEncoder.matches(loginDto.getPassword(), encodedPassword)) {
            throw new ResourceNotFoundException("비밀번호가 일치하지 않습니다.");
        }

        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(loginDto.getId(), loginDto.getPassword());

        Authentication authentication = authenticationManager.authenticate(token);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        HttpSession session = request.getSession(true);
        session.setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                SecurityContextHolder.getContext()
        );
        Map<String, Object> response = new HashMap<>();
        response.put("message", "로그인 성공");
        response.put("user_id", loginDto.getId());
        response.put("role", security_util.getCurrentUserRole());
        return ResponseEntity.ok(response);
    }



    @Operation(summary = "비밀번호 재설정 (인증 필요)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "비밀번호 재설정 성공 (메시지 문자열 반환)"),
            @ApiResponse(responseCode = "400", description = "백엔드 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @PostMapping("/api/auth/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody PasswordUpdateDTO passwordUpdateDto,
            @Parameter(hidden = true)
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        userService.resetPassword(passwordUpdateDto, userDetails);

        return ResponseEntity.ok("비밀번호가 재설정되었습니다.");
    }


    @Operation(summary = "내 세션 정보 조회 (인증 필요)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "내 정보 조회 성공 (JSON 객체 반환)",
                    content = @Content(schema = @Schema(type = "object", example = "{\"id\": \"testuser123\", \"role\": \"ROLE_USER\"}"))),
            @ApiResponse(responseCode = "400", description = "백엔드 오류",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/api/auth/me")
    public ResponseEntity<?> getMyInfo(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails != null) {
            int user_id = security_util.getCurrentUserId();
            String id = userDetails.getUsername();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();
            String nickname = userService.getUserNickName(user_id);

            Map<String, String> userInfo = new HashMap<>();
            userInfo.put("id", id);
            userInfo.put("role", role);
            userInfo.put("nickname", nickname);

            return ResponseEntity.ok(userInfo);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 정보가 없습니다.");
        }
    }

    //현재 세션을 기반으로 바우만타입 가져오기
    @Operation (summary = "내 바우만 타입 조회 (인증 필요)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "내 바우만 타입 조회 성공 (문자열 반환)",
                    content = @Content(schema = @Schema(type = "string", example = "Type A"))),
            @ApiResponse(responseCode = "400", description = "백엔드 오류",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "404", description = "유저를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/api/auth/my-baumann-type")
    public String getCurrentUserBaumannType(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        int currentId = security_util.getCurrentUserId();

        String current_baumannType = userService.findTypeByUserId(currentId);
        return ResponseEntity.ok(current_baumannType).getBody();
    }

}