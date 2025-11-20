package com.review.shop.dto.review;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ProductReviewDTO {
    private Integer review_id;
    private String content;
    private double rating;
    private int like_count;
    private int dislike_count;
    private String created_at;
    private int is_selected;

    @JsonIgnore  // JSON 응답에서 제외
    private String image_url;  // DB에서만 사용

    private List<String> images = new ArrayList<>();  // 최종 응답용

    // 사용자 정보
    private int user_id;
    private String nickname;
    private int baumann_id;
    private String baumann_type;
}