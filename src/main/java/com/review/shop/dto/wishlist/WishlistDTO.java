package com.review.shop.dto.wishlist;

import lombok.Data;

@Data
public class WishlistDTO {
    private int user_id;
    private int wish_item_id;
    private int product_id;

    private String prd_name;
    private String prd_brand;
    private int price;
}
