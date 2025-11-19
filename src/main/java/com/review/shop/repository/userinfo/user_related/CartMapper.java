package com.review.shop.repository.userinfo.user_related;

import com.review.shop.dto.cart.CartitemResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CartMapper {

    // 장바구니 조회
    List<CartitemResponseDTO> findCartItemsByUserId(@Param("user_id") int user_id);

    // 단일 상품 조회 (수량 변경 시 확인용)
    CartitemResponseDTO findCartItemByUserIdAndProductId(
            @Param("user_id") int user_id,
            @Param("product_id") int product_id
    );

    // 장바구니 추가
    void insertCartItem(
            @Param("user_id") int user_id,
            @Param("product_id") int product_id,
            @Param("quantity") int quantity
    );

    // 수량 변경
    void updateCartItemQuantity(
            @Param("user_id") int user_id,
            @Param("product_id") int product_id,
            @Param("quantity") int quantity
    );

    // 삭제
    void deleteCartItem(
            @Param("user_id") int user_id,
            @Param("product_id") int product_id
    );
}
