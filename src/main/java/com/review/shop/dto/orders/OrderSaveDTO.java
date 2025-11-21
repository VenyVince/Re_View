package com.review.shop.dto.orders;

import lombok.Data;

@Data
public class OrderSaveDTO {
    private int order_id;      // long -> int 변경
    private String order_no;
    private int user_id;
    private int address_id;
    private int payment_id;
    private int total_price;   // long -> int 변경
}