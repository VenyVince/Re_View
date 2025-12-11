package com.review.shop.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageResponse<T> {
    private List<T> content;     // 데이터 리스트 (상품, 리뷰, 주문 등 무엇이든 가능)
    private boolean hasNext;     // 다음 페이지 존재 여부
    private int page;            // 현재 페이지 번호
    private int size;            // 요청한 사이즈
}