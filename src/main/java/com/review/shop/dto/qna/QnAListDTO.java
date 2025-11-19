package com.review.shop.dto.qna;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
// 이름과 제목만 포함
public class QnAListDTO {
    private Long qna_id;
    private String user_name;
    private String title;
}
