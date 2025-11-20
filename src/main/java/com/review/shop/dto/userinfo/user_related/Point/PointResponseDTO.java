package com.review.shop.dto.userinfo.user_related.Point;

import lombok.Data;

import java.sql.Date;

@Data
public class PointResponseDTO {
    private Integer point_history_id;
    private int user_id;
    private Integer amount;
    private String type;
    private Date created_at;
    private String description;
}
