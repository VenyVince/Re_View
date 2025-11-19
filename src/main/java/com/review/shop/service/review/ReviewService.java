package com.review.shop.service.review;

import com.review.shop.dto.review.ReviewDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.repository.review.ReviewMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewMapper reviewMapper;

    public List<ReviewDTO> getReviewList(int page, int size, String sort) {
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

        try{
        // DB에서 조회
        List<ReviewDTO> result = reviewMapper.selectReviewList(offset, size, sort);

        return result;}
        catch(DataAccessException e){
            throw new DatabaseException("리뷰 목록 조회 중 DB오류 발생", e);
        }
    }
}