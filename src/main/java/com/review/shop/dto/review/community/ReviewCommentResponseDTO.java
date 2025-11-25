package com.review.shop.dto.review.community;

import lombok.Data;
import java.util.Date;

@Data
public class ReviewCommentResponseDTO {
    private int review_comment_id; // 댓글 조회 응답 ID
    private int review_id;
    private int user_id;
    private String user_nickname;
    private String content;
    private Date created_at;
}