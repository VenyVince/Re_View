package com.review.shop.controller.product;

import com.review.shop.dto.product.NextProductDTO;
import com.review.shop.dto.product.ProductDTO;
import com.review.shop.dto.product.ProductDetailDTO;
import com.review.shop.service.product.ProductDetailService;
import com.review.shop.service.product.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")

public class ProductController {

    private final ProductService productService;
    private final ProductDetailService productDetailService;



    @Operation(summary = "상품 목록 조회", description = "상품 목록을 페이징 및 정렬 조건에 따라 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터 (페이지 번호, 사이즈, 정렬 옵션 오류)"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @GetMapping
    public ResponseEntity<NextProductDTO<ProductDTO>> getProducts(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sort", defaultValue = "latest") String sort,
            @RequestParam(value = "category", required = false) String category // 카테고리 추가 (없으면 null)
    ) {
        NextProductDTO<ProductDTO> response = productService.getProductList(page, size, sort, category);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "상품 상세 조회", description = "상품 ID로 상세 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "상품을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @GetMapping("/{product_id}")
    public ResponseEntity<ProductDetailDTO> getProductDetail(@PathVariable Integer product_id) {
        ProductDetailDTO product = productDetailService.getProductDetail(product_id);
        return ResponseEntity.ok(product);
    }

}
