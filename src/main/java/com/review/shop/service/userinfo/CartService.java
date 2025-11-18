package com.review.shop.service.userinfo;

import com.review.shop.dto.cart.CartitemRequestDTO;
import com.review.shop.dto.cart.CartitemResponseDTO;
import com.review.shop.repository.userinfo.other.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartMapper cartMapper;

    // 장바구니 조회
    public List<CartitemResponseDTO> getCartItems(int user_id) {
        return cartMapper.findCartItemsByUserId(user_id);
    }

    // 장바구니 추가
    public void addCartItem(int user_id, CartitemRequestDTO dto) {
        CartitemResponseDTO existing = cartMapper.findCartItemByUserIdAndProductId(user_id, dto.getProduct_id());
        if (existing != null) {
            // 이미 존재하면 수량 증가
            int newQuantity = existing.getQuantity() + dto.getQuantity();
            cartMapper.updateCartItemQuantity(user_id, dto.getProduct_id(), newQuantity);
        } else {
            cartMapper.insertCartItem(user_id, dto.getProduct_id(), dto.getQuantity());
        }
    }

    // 수량 변경
    public void updateQuantity(int user_id, CartitemRequestDTO dto) {
        cartMapper.updateCartItemQuantity(user_id, dto.getProduct_id(), dto.getQuantity());
    }

    // 삭제
    public void deleteCartItem(int user_id, int product_id) {
        cartMapper.deleteCartItem(user_id, product_id);
    }
}
