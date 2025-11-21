package com.review.shop.dto.orders;

import lombok.Data;


@Data
public class OrderItemDTO {
    private long order_item_id;
    private long order_id;
    private int product_id;
    private String prd_name;
    private int product_price;
    private int quantity;
}