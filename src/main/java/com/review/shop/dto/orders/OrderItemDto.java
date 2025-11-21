package com.review.shop.dto.orders;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemDto {
    private int order_item_id;
    private int product_id;
    private String product_name;
    private int quantity;
    private BigDecimal product_price;
    private BigDecimal total_amount; // quantity * price
}