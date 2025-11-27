package com.review.shop.Util;

import com.review.shop.service.review.ProductReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReviewScheduler {

    private final ProductReviewService productReviewService;

    // 매달 1일 (서울기준) 오전 12시에 자동실행되도록
    @Scheduled(cron = "0 0 0 1 * *", zone = "Asia/Seoul")
    public void updateBestReviewMonthly() {
        productReviewService.updateBestReviews();
    }
}
