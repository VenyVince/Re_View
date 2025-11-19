package com.review.shop.dto.userinfo.others.wishlist;

import lombok.Data;

import java.util.List;

@Data
public class WishlistResponseDTO {
    private List<WishlistDTO> wishlist;
}
