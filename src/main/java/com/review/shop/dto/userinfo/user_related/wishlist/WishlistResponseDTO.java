package com.review.shop.dto.userinfo.user_related.wishlist;

import lombok.Data;

import java.util.List;

@Data
public class WishlistResponseDTO {
    private List<WishlistDTO> wishlist;
}
