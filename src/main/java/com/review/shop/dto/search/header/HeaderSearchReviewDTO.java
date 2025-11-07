package com.review.shop.dto.search.header;

import lombok.Data;

@Data
public class HeaderSearchReviewDTO {
//    private String nickname;
//    private String title;
    private String content;
    private float rating;
    private int like_count;
    private int dislike_count;
    private boolean is_selected;
}

