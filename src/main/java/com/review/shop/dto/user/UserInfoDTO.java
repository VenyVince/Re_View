package com.review.shop.dto.login;

//사용자의 정보에 대한 DTO


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserInfoDto {
    private int user_id;
    private String id;
    private String password;
    private String name;
    private String email;
    private String nickname;
    private String phoneNumber;
    private int baumannId;
    private String role;
}

