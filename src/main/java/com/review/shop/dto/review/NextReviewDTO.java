package com.review.shop.dto.review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NextReviewDTO<T> {
    private List<T> content;     // 리뷰 리스트
    private boolean hasNext;     // 다음 페이지 여부
    private int page;            // 현재 페이지
    private int size;            // 요청 사이즈
}