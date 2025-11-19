package com.review.shop.controller.search;

import com.review.shop.dto.search.ProductReview_SearchResponseDTO;
import com.review.shop.service.search.ProductReview_SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products/{product_id}/reviews/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "상품 리뷰 검색 API")
public class ProductReview_SearchController {

    private final ProductReview_SearchService searchService;

    @Operation(summary = "상품 리뷰 검색", description = "특정 상품의 리뷰를 키워드, 정렬, 평점 필터로 검색합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "검색 성공"),
            @ApiResponse(responseCode = "404", description = "검색 결과가 없음 (ResourceNotFoundException)"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    @GetMapping
    public ResponseEntity<ProductReview_SearchResponseDTO> search(
            @Parameter(description = "상품 아이디", example = "101")
            @PathVariable("product_id") int product_id,

            @Parameter(description = "검색 키워드", example = "촉촉")
            @RequestParam(required = false, defaultValue = "") String keyword,

            @Parameter(description = "정렬 기준(latest, rating 등)", example = "latest")
            @RequestParam(required = false, defaultValue = "latest") String sort,

            @Parameter(description = "평점 필터 (0~5)", example = "4.5")
            @RequestParam(required = false, defaultValue = "0") float filter_rating
    ){

        return ResponseEntity.ok(searchService.search(product_id, keyword, sort, filter_rating));
    }
}