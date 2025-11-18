package com.review.shop.dto.orders;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderCheckoutProductInfoDTO {
    private int prdId;
    private String prdImage;
    private String prdName;
    private int prdPrice;
    private int buyQuantity;
}


