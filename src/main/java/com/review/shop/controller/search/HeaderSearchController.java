package com.review.shop.controller.search;

import com.review.shop.dto.search.header.HeaderSearchDTO;
import com.review.shop.dto.search.header.ListHeaderSearchProductDTO;
import com.review.shop.dto.search.header.ListHeaderSearchReviewDTO;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.service.search.HeaderSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "헤더 검색 API")
public class HeaderSearchController {

    private final HeaderSearchService searchService;

    @Operation(summary = "헤더 검색", description = "키워드, 정렬, 브랜드/카테고리 필터로 검색 결과를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "검색 성공"),
            @ApiResponse(responseCode = "404", description = "검색 결과가 없음 (ResourceNotFoundException)"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    @GetMapping
    public ResponseEntity<HeaderSearchDTO> search(
            @Parameter(description = "검색 키워드(최소 2글자)", example = "스킨")
            @RequestParam(defaultValue = "") String keyword,

            @Parameter(description = "정렬 기준(latest, rating 등)", example = "latest")
            @RequestParam(required = false, defaultValue = "latest") String sort,

            @Parameter(description = "브랜드 필터", example = "라로슈포제")
            @RequestParam(required = false, defaultValue = "") String filter_brand,

            @Parameter(description = "카테고리 필터", example = "스킨케어")
            @RequestParam(required = false, defaultValue = "") String filter_category
    ) throws WrongRequestException {
        if(keyword.length()<2){
            throw new WrongRequestException("검색어는 2글자 이상부터입니다.");
        }

        return ResponseEntity.ok(searchService.search(keyword, sort, filter_brand, filter_category));
    }

    @Operation(summary = "어드민 리뷰 검색", description = "키워드, 정렬, 브랜드/카테고리 필터로 검색 결과를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "검색 성공"),
            @ApiResponse(responseCode = "404", description = "검색 결과가 없음 (ResourceNotFoundException)"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    @GetMapping("/reviews")
    public ResponseEntity<ListHeaderSearchReviewDTO> searchReviews(
            @Parameter(description = "검색 키워드(최소 2글자)", example = "스킨")
            @RequestParam(defaultValue = "") String keyword,

            @Parameter(description = "정렬 기준(latest, rating 등)", example = "latest")
            @RequestParam(required = false, defaultValue = "latest") String sort,

            @Parameter(description = "브랜드 필터", example = "라로슈포제")
            @RequestParam(required = false, defaultValue = "") String filter_brand,

            @Parameter(description = "카테고리 필터", example = "스킨케어")
            @RequestParam(required = false, defaultValue = "") String filter_category
    ) throws WrongRequestException {
        if(keyword.length()<2){
            throw new WrongRequestException("검색어는 2글자 이상부터입니다.");
        }
        return ResponseEntity.ok(searchService.searchReviews(keyword, sort, filter_brand, filter_category));
    }

    @Operation(summary = "어드민 상품 검색", description = "키워드, 정렬, 브랜드/카테고리 필터로 검색 결과를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "검색 성공"),
            @ApiResponse(responseCode = "404", description = "검색 결과가 없음 (ResourceNotFoundException)"),
            @ApiResponse(responseCode = "500", description = "DB 오류 (DatabaseException)")
    })
    @GetMapping("/products")
    public ResponseEntity<ListHeaderSearchProductDTO> searchProducts(
            @Parameter(description = "검색 키워드(최소 2글자)", example = "스킨")
            @RequestParam(defaultValue = "") String keyword,

            @Parameter(description = "정렬 기준(latest, rating 등)", example = "latest")
            @RequestParam(required = false, defaultValue = "latest") String sort,

            @Parameter(description = "브랜드 필터", example = "라로슈포제")
            @RequestParam(required = false, defaultValue = "") String filter_brand,

            @Parameter(description = "카테고리 필터", example = "스킨케어")
            @RequestParam(required = false, defaultValue = "") String filter_category
    ) throws WrongRequestException {
        if(keyword.length()<2){
            throw new WrongRequestException("검색어는 2글자 이상부터입니다.");
        }
        return ResponseEntity.ok(searchService.searchProducts(keyword, sort, filter_brand, filter_category));
    }
}