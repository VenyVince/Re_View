package com.review.shop.controller.review;

import com.review.shop.dto.review.ReviewDTO;
import com.review.shop.service.review.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getReviews(
            @RequestParam(value = "page", defaultValue = "1") int page, //페이지 번호 (기본값: 1)
            @RequestParam(value = "size", defaultValue = "1") int size, //페이지 당 개수 (기본값: 8)
            @RequestParam(value = "sort", defaultValue = "like_count") String sort) { //정렬 옵션 - latest(최신순), rating(평점순), like_count(추천순) (기본값: like_count)

        log.info("=== 리뷰 API 요청 ===");
        log.info("파라미터 - page: {}, size: {}, sort: {}", page, size, sort);

        try {
            List<ReviewDTO> reviews = reviewService.getReviewList(page, size, sort);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            log.error("에러 발생", e);
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}