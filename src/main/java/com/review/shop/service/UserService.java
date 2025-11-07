package com.review.shop.service;

import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.UserMapper;
import com.review.shop.dto.login.UserInfoDto;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    // 회원가입 로직 구현, DB 결과에 따른 예외 처리
    public void registerUser(UserInfoDto userDTO) {

        // 중복 ID 체크 추가
        if (userMapper.findUserById(userDTO.getId()) != null) {
            throw new WrongRequestException("이미 존재하는 아이디입니다.");
        }

        // 컨트롤러 부터 받은 dto 비밀번호를 암호화
        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());

        UserInfoDto encodedUser = new UserInfoDto(
                userDTO.getId(),
                encodedPassword,
                userDTO.getName(),
                userDTO.getEmail(),
                userDTO.getNickname(),
                userDTO.getPhoneNumber(),
                userDTO.getBaumannId(),
                userDTO.getRole()
        );

        int affected = userMapper.insertUser(encodedUser);

        if (affected != 1) {
            throw new WrongRequestException("회원가입에 실패했습니다.");
        }
    }

    // AuthenticationManager가 UserDetails을 받기위한 메소드
    // 로그인 데이터와 UserDetails의 데이터를 비교하여 인증 처리
    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {

        UserInfoDto user = userMapper.findUserById(id);

        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + id);
        }

        return User.builder()
                .username(user.getId())
                .password(user.getPassword()) // DB에 저장된 암호화된 비밀번호
                .roles(user.getRole()) // 사용자의 권한
                .build();
    }
}
