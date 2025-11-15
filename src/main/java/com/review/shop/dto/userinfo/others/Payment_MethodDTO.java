package com.review.shop.dto.userinfo.others;

import lombok.Data;

@Data
public class Payment_MethodDTO {
    private String payment_id;
    private String card_company;
    private String card_number;
    private boolean is_default;
    private boolean is_active;
}