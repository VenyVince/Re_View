package com.review.shop.dto.search.header;

import lombok.Data;

import java.sql.Date;
import java.util.List;

@Data
public class HeaderSearchReviewDTO {
    //collection 매핑용 id
    private int review_id;

    //    User_table
    private String nickname;
    private String content;
    private String user_baumann_type;

    //    Review_table
    private float rating;
    private int like_count;
    private int dislike_count;
    private boolean is_selected;
    private Date created_at;

    private String prd_name;
    private String prd_brand;
    private String category;

    //     Review_Image 테이블
    private List<String> image_urls;
}