package com.review.shop.dto.address;

import lombok.Data;

@Data
public class AddressDTO {
    private int address_id;

    private int user_id;

    private String address_name;

    private String recipient_name; // DB컬럼: recipient

    private String postal_code;

    private String address;

    private String detail_address;

    private String phone_number;   // DB컬럼: phone

    private String is_default;
}