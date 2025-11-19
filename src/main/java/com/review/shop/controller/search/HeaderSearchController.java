package com.review.shop.controller.search;

import com.review.shop.dto.search.HeaderSearchDTO;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.service.search.HeaderSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class HeaderSearchController {

    private final HeaderSearchService searchService;

    @GetMapping
    public ResponseEntity<HeaderSearchDTO> search(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "latest") String sort,
            @RequestParam(required = false, defaultValue = "") String filter_brand,
            @RequestParam(required = false, defaultValue = "") String filter_category
    ) throws WrongRequestException {
        if(keyword.length()<2){
            throw new WrongRequestException("검색어는 2글자 이상부터입니다.");
        }

        return ResponseEntity.ok(searchService.search(keyword, sort, filter_brand, filter_category));
    }
}