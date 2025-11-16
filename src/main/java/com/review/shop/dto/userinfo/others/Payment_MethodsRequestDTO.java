package com.review.shop.dto.userinfo.others;

import lombok.Data;

@Data
public class Payment_MethodsRequestDTO {
    private int payment_id;
    private int user_id;
    private String card_number;
    private String card_company;
}
