package com.review.shop.repository.userinfo.other;

import com.review.shop.dto.wishlist.WishlistDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper
public interface WishlistMapper {
    List<WishlistDTO> getWishlist(@Param("user_id") int user_id);

    // 현재 존재하는 wishlist인지 확인
    boolean existsWishlistItem(@Param("user_id") int user_id, @Param("product_id") int product_id);

    void insertWishlistItem(@Param("user_id") int user_id, @Param("product_id") int product_id);

    void deleteWishlistItem(@Param("user_id") int user_id, @Param("product_id") int product_id);

}
