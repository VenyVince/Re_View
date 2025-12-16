package com.review.shop.dto.orders;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderCheckoutProductInfoDTO {
    private int product_id;
    private String thumbnail_url;
    private String prd_name;
    private int price;
    private int buy_quantity;
}


