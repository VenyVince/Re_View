package com.review.shop.dto.userinfo;

import lombok.Data;

@Data
public class UserInfoResponseDTO {

    private int user_id;
    private String email;
    private String name;
    private String nickname;
    private String phoneNumber;
    private String point;
    private int baumann_id;
}
