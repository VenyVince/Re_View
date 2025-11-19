package com.review.shop.dto.orders;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


// 이 DTO는 주문을 생성할때 request body로 받는 데이터의 형태를 정의합니다.
@NoArgsConstructor
@Getter
@AllArgsConstructor
public class OrderDTO {
    private int product_id;

    private int buy_quantity;
}
