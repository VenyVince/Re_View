package com.review.shop.controller.review;

import com.review.shop.util.Security_Util;
import com.review.shop.service.review.Review_PointService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
@Tag(name = "Review Point API", description = "리뷰 관련 API")
public class Review_PointController {

    private final Review_PointService review_pointService;
    private final Security_Util security_Util;




}