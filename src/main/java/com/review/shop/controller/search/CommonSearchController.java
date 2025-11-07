package com.review.shop.controller.search;

import com.review.shop.dto.search.CommonSearchResponse;
import com.review.shop.service.search.CommonSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class CommonSearchController {

    @Autowired
    private CommonSearchService searchService;

    @GetMapping
    public ResponseEntity<CommonSearchResponse> search(@RequestParam String keyword) {
        CommonSearchResponse response = searchService.search(keyword);
        return ResponseEntity.ok(response);
    }
}