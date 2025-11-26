package com.review.shop.controller.review;

import com.review.shop.dto.review.NextReviewDTO;
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
    public ResponseEntity<NextReviewDTO<ReviewDTO>> getReviews(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "8") int size,
            @RequestParam(value = "sort", defaultValue = "like_count") String sort,
            @RequestParam(value = "category", required = false) String category) {

        // Service가 SliceResponseDTO를 반환함
        NextReviewDTO<ReviewDTO> reviews = reviewService.getReviewList(page, size, sort, category);

        return ResponseEntity.ok(reviews);
    }
}