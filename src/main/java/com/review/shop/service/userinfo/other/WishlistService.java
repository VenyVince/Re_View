package com.review.shop.service.userinfo.other;

import com.review.shop.dto.userinfo.user_related.wishlist.WishlistDTO;
import com.review.shop.dto.userinfo.user_related.wishlist.WishlistResponseDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.UserIdMapper;
import com.review.shop.repository.userinfo.user_related.WishlistMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {
    private final UserIdMapper userIdMapper;
    private final WishlistMapper wishlistMapper;

    public WishlistResponseDTO getWishlist(Integer user_id) {
        try {
            List<WishlistDTO> wishlist = wishlistMapper.getWishlist(user_id);
            WishlistResponseDTO response = new WishlistResponseDTO();
            response.setWishlist(wishlist);
            return response;
        } catch (DataAccessException e) {
            throw new DatabaseException("위시리스트 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    public void addWishlistItem(Integer user_id, int product_id) {
        try {
            boolean exists = wishlistMapper.existsWishlistItem(user_id, product_id);
            if (exists) {
                throw new WrongRequestException("이미 위시리스트에 추가한 상품입니다.");
            }
            wishlistMapper.insertWishlistItem(user_id, product_id);
        } catch (DataAccessException e) {
            throw new DatabaseException("위시리스트 추가 중 DB 오류가 발생했습니다.", e);
        }
    }

    public void deleteWishlistItem(Integer user_id, int product_id) {
        try {
            boolean exists = wishlistMapper.existsWishlistItem(user_id, product_id);
            if (!exists) {
                throw new WrongRequestException("위시리스트에 존재하지 않는 상품입니다.");
            }
            wishlistMapper.deleteWishlistItem(user_id, product_id);
        } catch (DataAccessException e) {
            throw new DatabaseException("위시리스트 삭제 중 DB 오류가 발생했습니다.", e);
        }
    }
}
