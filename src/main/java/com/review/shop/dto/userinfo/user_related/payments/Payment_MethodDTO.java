package com.review.shop.dto.userinfo.user_related.payments;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment_MethodDTO {

    private int payment_id;
    private int user_id;
    private String card_company;
    private String card_number;
}
