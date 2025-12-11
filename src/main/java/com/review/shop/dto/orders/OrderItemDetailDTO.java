package com.review.shop.dto.orders;

import lombok.Data;

@Data
public class OrderItemDetailDTO {
    private int order_item_id;
    private int product_id;
    private String product_name;
    private int quantity;
    private int product_price;
    private int total_amount; // quantity * price
}