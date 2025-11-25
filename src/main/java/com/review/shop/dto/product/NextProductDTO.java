package com.review.shop.dto.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NextProductDTO<T> {
    private List<T> content;     // 상품 리스트 (최대 20개)
    private boolean hasNext;     // 다음 페이지 존재 여부 (true면 > 버튼 활성화)
    private int page;            // 현재 페이지 번호 (프론트 표시용)
    private int size;            // 요청한 사이즈
}