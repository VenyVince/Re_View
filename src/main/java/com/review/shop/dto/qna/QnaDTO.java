package com.review.shop.dto.qna;

import lombok.Data;
import java.util.Date;

@Data
public class QnaDTO {
    private int qna_id;
    private int product_id;
    private int user_id;
    private String title;
    private String content;
    private String answer;      // 관리자 답변
    private Date created_at;
    private Date update_at;
    private Date deleted_at;
    private String prd_name; // 상품 이름 (JOIN)

    private String user_name;   // 작성자 이름 (JOIN)
    private String status;      // '답변대기' or '답변완료'
}