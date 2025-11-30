package com.review.shop.dto.review.community;

import lombok.Data;

@Data
public class LikeRequestDTO {
    // 프론트에서는 true(추천) / false(비추천)으로 보낼 예정
    private Boolean is_like;
}