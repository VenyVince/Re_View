package com.review.shop.controller.search;

import com.review.shop.dto.search.header.HeaderSearchDTO;
import com.review.shop.service.search.HeaderSearchService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class HeaderSearchController {

    @Autowired
    private HeaderSearchService searchService;

    @GetMapping
    public ResponseEntity<HeaderSearchDTO> search(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "latest") String sort,
            @RequestParam(required = false, defaultValue = "0") float filter_rating
    ) throws BadRequestException {
        if(keyword.length()<2){
            throw new BadRequestException("검색어는 2글자 이상부터입니다.");
        }

        return ResponseEntity.ok(searchService.search(keyword, sort, filter_rating));
//        CommonSearchResponse response = searchService.search(keyword);
//        return ResponseEntity.ok(response);
    }
}