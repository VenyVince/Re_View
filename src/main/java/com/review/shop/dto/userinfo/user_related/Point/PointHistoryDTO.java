package com.review.shop.dto.userinfo.user_related.Point;

import lombok.Data;

@Data
public class PointHistoryDTO {
    private int user_id;
    private int amount;
    private String type; //사용, 적립의 경우 //테이블 수정해야함
    private String description;
}
