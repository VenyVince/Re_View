package com.review.shop.dto.orders;

import lombok.Data;

import java.util.Date;

@Data
public class OrderListResponseDTO {
    private long order_id;
    private Date created_at;
    private String order_status;
    private int total_price;
    private String delivery_num;

    // SQL 서브쿼리 결과
    private String rep_product_name; // 대표 상품명 (예: 스킨 외 2건 할때 '스킨')
    private int total_item_count;    // 총 상품 개수
}