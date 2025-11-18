package com.review.shop.dto.userinfo.others;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment_MethodResponseDTO
{
    private int payment_id;
    private String card_company;
    private String card_number;
}