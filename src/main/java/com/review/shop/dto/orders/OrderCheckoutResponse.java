package com.review.shop.dto.orders;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderCheckoutResponse {
    private List<OrderCheckoutProductInfoDTO> products;
    private int totalPrice;
}