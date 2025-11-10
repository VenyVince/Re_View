package com.review.shop.dto.userinfo;

public class AddressDTO {
    private int address_id;
    private String address_name;            // 사용자가 지정하는 주소지 명
    private String phone;
    private String recipient;               //수령인
    private int postal_code;
    private String detail_address;
    private boolean is_default;             //기본 주소인지 여부

}