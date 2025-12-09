package com.review.shop.dto.orders;

import lombok.Data;

@Data
public class OrderAdminDTO {
    private String user_name;
    private Integer total_price ;
    private String order_status;
    private String order_no;
    private String delivery_num;
    private String created_at;
    private Integer order_id;
}