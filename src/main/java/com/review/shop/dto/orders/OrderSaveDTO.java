package com.review.shop.dto.orders;

import lombok.Data;

@Data
public class OrderSaveDTO {
    private long order_id;       // DB 저장 시 생성됨 (SelectKey)
    private String order_no;     // 로직으로 생성한 주문번호
    private int user_id;
    private int address_id;
    private int payment_id;
    private long total_price;
}