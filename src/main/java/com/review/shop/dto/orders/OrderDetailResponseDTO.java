package com.review.shop.dto.orders;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class OrderDetailResponseDTO {
    private int order_id;
    private Date created_at;
    private String order_status;
    private String delivery_num;
    private int total_price;

    //유저 사용 포인트
    private int used_point;

    // 배송지 정보 (Address 테이블)
    private String recipient;
    private String postal_code;
    private String address;
    private String detail_address;
    private String phone;

    // 결제 정보 (PaymentMethods 테이블)
    private String card_company;
    private String card_number;

    // 주문 상품 리스트
    private List<OrderItemDetailDTO> order_items;


}