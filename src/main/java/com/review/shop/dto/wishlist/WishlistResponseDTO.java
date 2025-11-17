package com.review.shop.dto.wishlist;

import lombok.Data;

import java.util.List;

@Data
public class WishlistResponseDTO {
    private List<WishlistDTO> wishlist;
}
