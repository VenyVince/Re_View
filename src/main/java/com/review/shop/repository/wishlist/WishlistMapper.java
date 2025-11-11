package com.review.shop.repository.wishlist;

import com.review.shop.dto.wishlist.WishlistDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper
public interface WishlistMapper {
    List<WishlistDTO> getWishlist(@Param("user_id") int user_id);

    boolean existsWishlistItem(@Param("user_id") int user_id, @Param("product_id") int product_id);

    void insertWishlistItem(@Param("user_id") int user_id, @Param("product_id") int product_id);

    void deleteWishlistItem(@Param("user_id") int user_id, @Param("product_id") int product_id);

}
