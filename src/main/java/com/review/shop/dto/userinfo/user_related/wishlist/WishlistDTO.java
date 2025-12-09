package com.review.shop.dto.userinfo.user_related.wishlist;

import lombok.Data;

@Data
public class WishlistDTO {
    private int user_id;
    private int wish_item_id;
    private int product_id;

    private String prd_name;
    private String prd_brand;
    private int price;

    private String image_url;
    private String product_thumbnail_url;
}