package com.review.shop.controller.recommendations;

import com.review.shop.service.recommendations.RecommendationsService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RecommendationsController {

    RecommendationsService recommendationsService;

    @GetMapping("/api/recommendations")
    public ResponseEntity<String> getRecommendations() {

        recommendationsService.

        return ResponseEntity.ok("Recommendations");
    }
}
