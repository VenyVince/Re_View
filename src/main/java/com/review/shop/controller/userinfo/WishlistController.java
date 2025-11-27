package com.review.shop.controller.userinfo;

import com.review.shop.util.Security_Util;
import com.review.shop.dto.userinfo.user_related.wishlist.WishlistResponseDTO;
import com.review.shop.service.userinfo.user_related.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor@Tag(name = "Wishlist", description = "찜 목록 관련 API")
public class WishlistController {

    private final Security_Util security_Util;
    private final WishlistService wishlistService;

    @Operation(summary = "찜 목록 조회", description = "현재 사용자의 찜 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    @GetMapping
    public ResponseEntity<?> getWishlist() {
        int user_id = security_Util.getCurrentUserId();
        WishlistResponseDTO wishlist = wishlistService.getWishlist(user_id);
        return ResponseEntity.ok(wishlist);
    }

    @Operation(summary = "찜 목록 추가", description = "특정 상품을 찜 목록에 추가합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "추가 성공"),
            @ApiResponse(responseCode = "400", description = "이미 추가된 상품 (WrongRequestException)"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    @PostMapping
    public ResponseEntity<?> addWishlist(
            @Parameter(description = "추가할 상품 ID", example = "101")
            @RequestParam("product_id") int product_id ){

        int user_id = security_Util.getCurrentUserId();
        wishlistService.addWishlistItem(user_id, product_id);
        return ResponseEntity.ok("상품이 찜 목록에 추가되었습니다");
    }

    @Operation(summary = "찜 목록 삭제", description = "특정 상품을 찜 목록에서 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "400", description = "존재하지 않는 상품 (WrongRequestException)"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    @DeleteMapping
    public ResponseEntity<?> deleteWishlist(
            @Parameter(description = "삭제할 상품 ID", example = "101")
            @RequestParam("product_id") int product_id) {
        int user_id = security_Util.getCurrentUserId();
        wishlistService.deleteWishlistItem(user_id, product_id);
        return ResponseEntity.ok("상품이 찜 목록에서 삭제되었습니다.");
    }
}
