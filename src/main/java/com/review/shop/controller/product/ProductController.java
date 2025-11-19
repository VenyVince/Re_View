package com.review.shop.controller.product;

import com.review.shop.dto.product.ProductDTO;
import com.review.shop.dto.product.ProductDetailDTO;
import com.review.shop.service.product.ProductDetailService;
import com.review.shop.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {
    
    // 예외 서비스에서 모두 받음

    // 1. 두 서비스를 모두 주입받습니다.
    private final ProductService productService;
    private final ProductDetailService productDetailService;

    // [기존] 상품 목록 조회 (GET /api/products?page=1&size=8...)
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getProducts(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "8") int size,
            @RequestParam(value = "sort", defaultValue = "latest") String sort) {
        List<ProductDTO> products = productService.getProductList(page, size, sort);
        return ResponseEntity.ok(products);
    }

    // [추가됨] 상품 상세 조회 (GET /api/products/{productId})
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDetailDTO> getProductDetail(@PathVariable Integer productId) {
        ProductDetailDTO product = productDetailService.getProductDetail(productId);
        return ResponseEntity.ok(product);
    }
}
