package com.review.shop.controller.userinfo;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.wishlist.WishlistResponseDTO;
import com.review.shop.service.userinfo.other.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final Security_Util security_Util;
    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<?> getWishlist() {
        int user_id = security_Util.getCurrentUserId();
        WishlistResponseDTO wishlist = wishlistService.getWishlist(user_id);
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/wish_item")
    public ResponseEntity<?> addWishlist(
            @RequestParam("product_id") int product_id ){

        int user_id = security_Util.getCurrentUserId();
        wishlistService.addWishlistItem(user_id, product_id);
        return ResponseEntity.ok("상품이 찜 목록에 추가되었습니다");
    }

    @DeleteMapping("/wish_item")
    public ResponseEntity<?> deleteWishlist(
            @RequestParam("product_id") int product_id) {
        int user_id = security_Util.getCurrentUserId();
        wishlistService.deleteWishlistItem(user_id, product_id);
        return ResponseEntity.ok("상품이 찜 목록에서 삭제되었습니다.");
    }
}
