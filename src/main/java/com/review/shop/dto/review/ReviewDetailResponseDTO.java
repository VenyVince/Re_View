package com.review.shop.dto.review;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ReviewDetailResponseDTO {
    private ReviewDetailDTO review;
    private ProductInfoDTO product;
    private List<CommentDTO> comments;

    // 1. 리뷰 상세 정보
    @Data
    public static class ReviewDetailDTO {
        private int review_id;
        private int product_id;
        private String nickname;
        private String baumann_type; // 피부 타입
        private int rating;
        private String content;
        private List<String> images; // 리뷰 이미지 리스트
        private String created_at;
        private int like_count;
        private int dislike_count;
        private boolean user_liked;    // 내가 좋아요 눌렀는지
        private boolean user_disliked; // 내가 싫어요 눌렀는지
    }

    // 2. 상품 정보
    @Data
    public static class ProductInfoDTO {
        private int product_id;
        private String prd_name;
        private String prd_brand;
        private String product_image; // 대표 이미지 1장
        private int price;
        private String category;
    }

    // 3. 댓글 정보
    @Data
    public static class CommentDTO {
        private int comment_id;
        private String nickname;
        private String content;
        private String created_at;
    }
}