package com.review.shop.dto.qna;


//QNA_ID
//PRODUCT_ID
//USER_ID
//TITLE
//CONTENT
//ANSWER
//CREATED_AT
//ANSWERED_AT

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@AllArgsConstructor
public class QnADTO {
    private Long qnaId;
    private Long productId;
    private Long userId;
    private String title;
    private String content;
    private String answer;
    private String createdAt;
    private String answeredAt;
}
