package com.review.shop.dto.orders;

import lombok.Data;

import java.util.List;

// 실 주문 생성 시 필요한 데이터를 담는 DTO

@Data
public class OrderCreateDTO {
    List<OrderDTO> order_list;

    Integer user_id;

    int using_point;
    //address 테이블
    int address_id;

    int payment_id;
}