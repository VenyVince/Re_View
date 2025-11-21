package com.review.shop.dto.user;

// Admin에서 모든 회원 조회시 필요한 DTO

import lombok.Data;

//USER_ID
//ID
//NAME
//NICKNAME
@Data
public class UserSummaryDTO {
    private int user_id;
    private String id;
    private String name;
    private String nickname;
}
