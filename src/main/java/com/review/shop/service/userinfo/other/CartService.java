package com.review.shop.service.userinfo.other;

import com.review.shop.dto.cart.CartitemRequestDTO;
import com.review.shop.dto.cart.CartitemResponseDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.image.ImageService;
import com.review.shop.repository.userinfo.user_related.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartMapper cartMapper;
    private final ImageService imageService;

    public List<CartitemResponseDTO> getCartItems(int user_id) {
        try {
            List<CartitemResponseDTO> cartItems = cartMapper.findCartItemsByUserId(user_id);

            if (cartItems.isEmpty()) {
                throw new ResourceNotFoundException("장바구니에 담긴 상품이 없습니다.");
            }

            for (CartitemResponseDTO item : cartItems) {
                String objectKey = item.getImage_url();

                if (objectKey != null && !objectKey.isEmpty()) {
                    String imageUrl = imageService.presignedUrlGet(objectKey);
                    item.setProduct_thumbnail_url(imageUrl);
                }
            }

            return cartItems;
        } catch (DataAccessException e) {
            throw new DatabaseException("장바구니 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 장바구니 추가
    public void addCartItem(int user_id, CartitemRequestDTO dto) {
        try {
            CartitemResponseDTO existing = cartMapper.findCartItemByUserIdAndProductId(user_id, dto.getProduct_id());
            if (existing != null) {
                int newQuantity = existing.getQuantity() + dto.getQuantity();
                cartMapper.updateCartItemQuantity(user_id, dto.getProduct_id(), newQuantity);
            } else {
                cartMapper.insertCartItem(user_id, dto.getProduct_id(), dto.getQuantity());
            }
        } catch (DataAccessException e) {
            throw new DatabaseException("장바구니 추가 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 수량 변경
    public void updateQuantity(int user_id, CartitemRequestDTO dto) {
        try {
            CartitemResponseDTO existing = cartMapper.findCartItemByUserIdAndProductId(user_id, dto.getProduct_id());
            if (existing == null) {
                throw new ResourceNotFoundException("수정할 장바구니 상품이 존재하지 않습니다.");
            }
            cartMapper.updateCartItemQuantity(user_id, dto.getProduct_id(), dto.getQuantity());
        } catch (DataAccessException e) {
            throw new DatabaseException("장바구니 수량 변경 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 삭제
    public void deleteCartItem(int user_id, int product_id) {
        try {
            CartitemResponseDTO existing = cartMapper.findCartItemByUserIdAndProductId(user_id, product_id);
            if (existing == null) {
                throw new ResourceNotFoundException("삭제할 장바구니 상품이 존재하지 않습니다.");
            }
            cartMapper.deleteCartItem(user_id, product_id);
        } catch (DataAccessException e) {
            throw new DatabaseException("장바구니 삭제 중 DB 오류가 발생했습니다.", e);
        }
    }
}