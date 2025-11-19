package com.review.shop.dto.search.MyPagenProductPage.MyPage;

import lombok.Data;

import java.sql.Date;

@Data
public class MyPageReviewDTO {
    private String prd_name;

    private String content;
    private Date created_at;
    private float rating;

    private int baumann_id;
}
