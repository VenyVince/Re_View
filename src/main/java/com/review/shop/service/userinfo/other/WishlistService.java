package com.review.shop.service.userinfo.other;

import com.review.shop.dto.wishlist.WishlistDTO;
import com.review.shop.dto.wishlist.WishlistResponseDTO;
import com.review.shop.repository.UserIdMapper;
import com.review.shop.repository.userinfo.other.WishlistMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {
    private final UserIdMapper userIdMapper;
    private final WishlistMapper wishlistMapper;

    public WishlistResponseDTO getWishlist(int user_id){
        List<WishlistDTO> wishlist =  wishlistMapper.getWishlist(user_id);
        WishlistResponseDTO response = new WishlistResponseDTO();
        response.setWishlist(wishlist);
        return response;
    }

    public void addWishlistItem(int user_id, int product_id) {
        boolean exists = wishlistMapper.existsWishlistItem(user_id, product_id);
        if (exists) {
            throw new IllegalStateException("이미 위시리스트에 추가한 상품입니다.");
        }

        wishlistMapper.insertWishlistItem(user_id, product_id);
    }

    public void deleteWishlistItem(int user_id, int product_id) {
        boolean exists = wishlistMapper.existsWishlistItem(user_id, product_id);
        if(exists){
            wishlistMapper.deleteWishlistItem(user_id, product_id);
        }
        else{
            throw new IllegalStateException("위시리스트에 존재하지 않는 상품입니다.");
        }
    }
}
