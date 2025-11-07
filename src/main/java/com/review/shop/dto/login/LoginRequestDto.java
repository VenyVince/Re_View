package com.review.shop.dto.login;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDto {
    private String id;
    private String password;
}