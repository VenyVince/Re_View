package com.review.shop.dto.qna;

import lombok.Data;
import java.util.Date;

@Data
public class QnaListResponseDTO {
    private int qna_id;
    private String prd_name;    // 상품명
    private String title;       // 문의 제목
    private Date created_at;    // 작성일
    private String status;      // '답변대기' or '답변완료' (DB에서 계산해서 가져옴)
}