package com.review.shop.dto.search.MyPageProductPage.MyPage;

import lombok.Data;

import java.sql.Date;
import java.util.List;

@Data
public class MyPageReviewDTO {
    private int review_id;

    private String prd_name;

    private String content;
    private Date created_at;
    private float rating;

    private int baumann_id;

    private List<String> image_urls;
}
