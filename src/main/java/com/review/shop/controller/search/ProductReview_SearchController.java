package com.review.shop.controller.search;

import com.review.shop.dto.search.ProductReview_SearchResponseDTO;
import com.review.shop.service.search.ProductReview_SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products/{product_id}/reviews/search")
@RequiredArgsConstructor
public class ProductReview_SearchController {

    private final ProductReview_SearchService searchService;

    @GetMapping
    public ResponseEntity<ProductReview_SearchResponseDTO> search(
            @PathVariable("product_id") int product_id,
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "latest") String sort,
            @RequestParam(required = false, defaultValue = "0") float filter_rating
    ){

        return ResponseEntity.ok(searchService.search(product_id, keyword, sort, filter_rating));
    }
}