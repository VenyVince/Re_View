package com.review.shop.controller;

import com.review.shop.dto.ProductDTO;
import com.review.shop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getProducts(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "8") int size,
            @RequestParam(value = "sort", defaultValue = "latest") String sort) {

        log.info("=== API 요청 ===");
        log.info("파라미터 - page: {}, size: {}, sort: {}", page, size, sort);

        try {
            List<ProductDTO> products = productService.getProductList(page, size, sort);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("❌ 에러 발생!!", e);  // ← 이 줄 추가!
            e.printStackTrace();               // ← 이 줄 추가!
            return ResponseEntity.status(500).build();
        }
    }
}
