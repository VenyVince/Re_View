package com.review.shop.dto.qna;

import lombok.Data;

////
//QNA_ID	NUMBER
//PRODUCT_ID	NUMBER
//USER_ID	NUMBER
//TITLE	VARCHAR2(200 BYTE)
//CONTENT	CLOB
//ANSWER	CLOB
//CREATED_AT	DATE
//DELETED_AT	DATE
//ANSWERED_AT	DATE

@Data
public class QnaAdminDTO {
    private int qna_id;
    private int product_id;
    private String prd_name; // 상품 이름 (JOIN)
    private int user_id;
    private String title;
    private String content;
    private String answer;      // 관리자 답변
    private String status;// '답변대기' or '답변완료'
    private String user_name;
}
