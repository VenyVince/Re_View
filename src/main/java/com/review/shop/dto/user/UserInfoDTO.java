package com.review.shop.dto.user;

//사용자의 정보에 대한 DTO


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserInfoDTO {
    private String id;
    private String password;
    private String name;
    private String email;
    private String nickname;
    private String phoneNumber;
    private int baumannId;
    private String role;
}

