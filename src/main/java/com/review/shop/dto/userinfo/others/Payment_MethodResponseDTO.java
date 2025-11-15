package com.review.shop.dto.userinfo.others;

import lombok.Data;

import java.util.List;


@Data
public class Payment_MethodResponseDTO {
    List<Payment_MethodDTO> payment_methods;
}
