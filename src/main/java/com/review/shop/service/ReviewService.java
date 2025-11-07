package com.review.shop.service;

import com.review.shop.dto.ReviewDTO;
import com.review.shop.repository.ReviewMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewMapper reviewMapper;

    public List<ReviewDTO> getReviewList(int page, int size, String sort) {
        log.debug("ReviewService 호출 - page: {}, size: {}, sort: {}", page, size, sort);

        // 유효성 검사
        if (page < 1) page = 1;
        if (size < 1 || size > 100) size = 1;

        // sort 기본값 설정
        if (sort == null || sort.isEmpty()) {
            sort = "like_count";
        }

        // 정렬 옵션 검증
        if (!sort.equals("latest") && !sort.equals("rating") && !sort.equals("like_count")) {
            sort = "like_count";
        }

        // offset 계산 (0부터 시작)
        int offset = (page - 1) * size;
        log.debug("계산된 offset: {}", offset);

        // DB에서 조회
        List<ReviewDTO> result = reviewMapper.selectReviewList(offset, size, sort);
        log.debug("DB 조회 결과: {} 개 리뷰 반환", result.size());

        return result;
    }
}