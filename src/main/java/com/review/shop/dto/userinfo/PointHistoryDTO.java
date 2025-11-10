package com.review.shop.dto.userinfo;

import java.sql.Date;

public class PointHistoryDTO {
    private int point_history_id;
    private int order_id;
    private int user_id;
    private int amount;
    private boolean type; //사용, 적립의 경우 //테이블 수정해야함
    private Date created_at;
    private String description;
}
