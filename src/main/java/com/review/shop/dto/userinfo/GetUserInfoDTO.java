package com.review.shop.dto.userinfo;

import lombok.Data;

@Data
public class GetUserInfoDTO {
    private int user_id;
    private String name;
    private String nickname;
    private String phone_number;
    private String point;
    private Integer baumann_id;
}
