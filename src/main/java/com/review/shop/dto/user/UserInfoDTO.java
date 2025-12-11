package com.review.shop.dto.user;

//사용자의 정보에 대한 DTO


import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UserInfoDTO {
    private int user_id;
    private String id;
    private String password;
    private String name;
    private String email;
    private String nickname;
    private String phone_number;
    private String baumann_id; // 기존에 int였는데 String으로 변환
    private String role;
}

