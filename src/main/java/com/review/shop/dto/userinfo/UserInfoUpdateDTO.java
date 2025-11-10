package com.review.shop.dto.userinfo;

import lombok.Data;

@Data
public class UserInfoUpdateDTO {
    private int user_id;
    private String password;
    private String phoneNumber;
    private int baumann_id;
}
