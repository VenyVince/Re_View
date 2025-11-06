package com.review.shop.controller.search;

import com.review.shop.dto.search.CommonSearchDTO;
import com.review.shop.service.search.CommonSearchService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class CommonSearchController {

    @Autowired
    private CommonSearchService searchService;

    @GetMapping
    public ResponseEntity<CommonSearchDTO> search(
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "latest") String sort, //미구현
            @RequestParam(required = false, defaultValue = "") String filter //미구현
    ) throws BadRequestException {
        if(keyword.length()<2){
            throw new BadRequestException("검색어는 2글자 이상부터입니다.");
        }

        return ResponseEntity.ok(searchService.search(keyword));
//        CommonSearchResponse response = searchService.search(keyword);
//        return ResponseEntity.ok(response);
    }
}