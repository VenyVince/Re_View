package com.review.shop.dto.userinfo;

import lombok.Data;

@Data
public class UpdateUserInfoDTO {
    private String nickname;
    private String password;
    private String phoneNumber;
    private int baumann_id;
}
