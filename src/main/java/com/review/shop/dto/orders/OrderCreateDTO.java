package com.review.shop.dto.orders;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

// 실 주문 생성 시 필요한 데이터를 담는 DTO

@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OrderCreateDTO {
    private List<OrderDTO> order_list;

    private int user_id;

    private int using_point;

    private int final_price;

    //address 테이블
    private int address_id;

    private int payment_id;
}