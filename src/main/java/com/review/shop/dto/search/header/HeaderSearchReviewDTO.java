package com.review.shop.dto.search.header;

import lombok.Data;

import java.sql.Date;

@Data
public class HeaderSearchReviewDTO {
    //    User_table
    private String nickname;
    private String content;
    private String user_baumann_type;

    //    Review_table
    private int review_id;
    private float rating;
    private int like_count;
    private int dislike_count;
    private boolean is_selected;
    private Date created_at;

    private int product_id;
    private String prd_name;
    private String prd_brand;
    private String category;
}