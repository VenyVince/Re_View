package com.review.shop.controller.userinfo;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.cart.CartitemRequestDTO;
import com.review.shop.dto.cart.CartitemResponseDTO;
import com.review.shop.service.userinfo.other.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "장바구니 관련 API")
public class CartController {


    private final CartService cartService;
    private final Security_Util security_util;

    // 장바구니 조회
    @Operation(summary = "장바구니 조회", description = "현재 사용자의 장바구니 목록을 조회합니다.")
    @GetMapping
    public List<CartitemResponseDTO> getCart() {
        int user_id = security_util.getCurrentUserId();
        return cartService.getCartItems(user_id);
    }

    // 장바구니 추가
    @Operation(summary = "장바구니 추가", description = "상품을 장바구니에 추가합니다.")
    @PostMapping
    public ResponseEntity<String> addCart(@RequestBody CartitemRequestDTO dto) {
        int user_id = security_util.getCurrentUserId();
        cartService.addCartItem(user_id, dto);
        return ResponseEntity.ok("장바구니에 추가되었습니다.");
    }

    // 수량 변경
    @Operation(summary = "수량 변경", description = "장바구니에 담긴 상품 수량을 변경합니다.")
    @PatchMapping
    public ResponseEntity<String> updateCart(@RequestBody CartitemRequestDTO dto) {
        int user_id = security_util.getCurrentUserId();
        cartService.updateQuantity(user_id, dto);
        return ResponseEntity.ok("수량이 변경되었습니다.");
    }

    // 삭제
    @Operation(summary = "삭제", description = "장바구니에서 특정 상품을 삭제합니다.")
    @DeleteMapping
    public ResponseEntity<String> deleteCart(@RequestBody Map<String, Integer> request) {
        int product_id = request.get("product_id");
        int user_id = security_util.getCurrentUserId();
        cartService.deleteCartItem(user_id, product_id);
        return ResponseEntity.ok("장바구니에서 삭제되었습니다.");
    }
}
