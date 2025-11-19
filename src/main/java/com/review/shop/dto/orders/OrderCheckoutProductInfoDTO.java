package com.review.shop.dto.orders;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderCheckoutProductInfoDTO {
    private int product_id;
    private String image_url;
    private String prd_name;
    private int price;
    private int buy_quantity;
}


