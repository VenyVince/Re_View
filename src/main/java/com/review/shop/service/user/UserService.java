package com.review.shop.service.user;

import com.review.shop.dto.user.PasswordUpdateDTO;
import com.review.shop.dto.user.UserInfoDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.user.UserMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Slf4j
@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    // 회원가입 로직 구현, DB 결과에 따른 예외 처리
    public void registerUser(UserInfoDTO userDTO) {

        // 중복 ID 체크 추가
        if (userMapper.findUserById(userDTO.getId()) != null) {
            throw new WrongRequestException("이미 존재하는 아이디입니다.");
        }

        // 컨트롤러 부터 받은 dto 비밀번호를 암호화
        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());

        UserInfoDTO encodedUser = new UserInfoDTO(
                0,
                userDTO.getId(),
                encodedPassword,
                userDTO.getName(),
                userDTO.getEmail(),
                userDTO.getNickname(),
                userDTO.getPhone_number(),
                userDTO.getBaumann_id(),
                userDTO.getRole()
        );

        int affected = userMapper.insertUser(encodedUser);

        if (affected != 1) {
            throw new DatabaseException("회원가입에 실패했습니다.");
        }
    }


    // ID로 사용자 정보 조회(user_id포함)
    public UserInfoDTO getUserByLoginId(String id) {
        log.debug("getUserByLoginId 호출 - id: {}", id);

        UserInfoDTO user = userMapper.findUserById(id);

        if (user == null) {
            throw new ResourceNotFoundException("사용자를 찾을 수 없습니다: " + id);
        }

        return user;
    }

    // AuthenticationManager가 UserDetails을 받기위한 메소드
    // 로그인 데이터와 UserDetails의 데이터를 비교하여 인증 처리
    @Override
    public UserDetails loadUserByUsername(String id) {

        UserInfoDTO user = userMapper.findUserById(id);

        if (user == null) {
            throw new WrongRequestException("사용자를 찾을 수 없습니다: " + id);
        }

        return User.builder()
                .username(user.getId())
                .password(user.getPassword()) // DB에 저장된 암호화된 비밀번호
                .roles(user.getRole()) // 사용자의 권한
                .build();
    }

    // 아이디 중복 확인 메서드
    public boolean isDuplicateId(String id) {
        UserInfoDTO user = userMapper.findUserById(id);
        return user != null;

    }

    // 비밀번호 재설정 메서드
    public void resetPassword(PasswordUpdateDTO passwordUpdateDto, UserDetails userDetails) {

        String currentId = userDetails.getUsername();
        UserInfoDTO user = userMapper.findUserById(currentId);
        if(user == null) throw new ResourceNotFoundException("사용자를 찾을 수 없습니다.");

        String currentPassword = user.getPassword();

        boolean is_matched = passwordEncoder.matches(passwordUpdateDto.getCurrentPassword(), currentPassword);
        if(!is_matched) throw new WrongRequestException("현재 비밀번호가 일치하지 않습니다.");

        String newEncodedPassword = passwordEncoder.encode(passwordUpdateDto.getNewPassword());
        int affected = userMapper.updatePassword(currentId, newEncodedPassword);
        if(affected != 1) throw new DatabaseException("비밀번호 재설정에 실패했습니다.");


    }


    //임시 비밀번호 전송 메서드
    public void sendTempPassword(String userEmail, String temPassWord) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(userEmail);
        message.setSubject("임시 비밀번호가 발급되었습니다.");

        String mailContent = "안녕하세요.\n"
                + "귀하의 임시 비밀번호는 **[" + temPassWord + "]** 입니다.\n"
                + "보안을 위해 로그인 후 반드시 새 비밀번호로 변경해 주세요.";

        message.setText(mailContent);

        mailSender.send(message);

    }

    //임시비밀번호로 유저 비밀번호 변경
    public void updatePasswordWithTempPassword(String id, String temPassWord) {
        String newEncodedPassword = passwordEncoder.encode(temPassWord);
        int affected = userMapper.updatePassword(id, newEncodedPassword);
        if(affected != 1) throw new DatabaseException("임시 비밀번호로 변경에 실패했습니다.");
    }

    // 메일 전송과 비밀번호 변경 트랜잭션

    @Transactional
    public void processTempPasswordEmail(String id, String userEmail) {
        if(!userEmail.equals(userMapper.findEmailById(id))) {
            throw new WrongRequestException("아이디나 이메일이 틀렸습니다.");
        }

        String tempPassword = generateTempPassword();

        updatePasswordWithTempPassword(id, tempPassword);

        sendTempPassword(userEmail, tempPassword);
    }




    //임시비밀번호 만들기
    public String generateTempPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder tempPassword = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < 8; i++) {
            tempPassword.append(chars.charAt(random.nextInt(chars.length())));
        }

        return tempPassword.toString();
    }

    //findIdByNameAndPhoneNumber 구현 하기
    public String findIdByNameAndPhoneNumber(String name, String phoneNumber) {
        String user_id = userMapper.findUserIdByNameAndPhoneNumber(name, phoneNumber);
        if (user_id == null) {
            throw new ResourceNotFoundException("일치하는 사용자가 없습니다.");
        }
        return user_id;
    }

    // 반영된 사항이 있다면 강퇴된 사용자
    public boolean isUserBanned(int id) {
        return userMapper.findBannedByUserId(id) > 0;
    }

}