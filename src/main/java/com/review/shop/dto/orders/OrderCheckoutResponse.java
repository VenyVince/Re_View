package com.review.shop.dto.orders;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderCheckoutResponse {
    private List<OrderCheckoutProductInfoDTO> products;
    private int totalPrice;
}