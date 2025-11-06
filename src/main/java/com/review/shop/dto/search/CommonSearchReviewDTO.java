package com.review.shop.dto.search;

import lombok.Data;

@Data
public class CommonSearchReviewDTO {
    private String nickname;
    private String title;
    private String content;
    private float rating;
    private int like_count;
    private int dislike_count;
    private boolean is_selected;
}

