package com.review.shop.service.review;

import com.review.shop.dto.common.PageResponse;
import com.review.shop.dto.review.ReviewDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.WrongRequestException;
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

    public PageResponse<ReviewDTO> getReviewList(int page, int size, String sort, String category) {
        // 유효성 검사
        if (page < 1) throw new WrongRequestException("페이지 값이 올바르지 않습니다.");
        if (size < 1 || size > 100) throw new WrongRequestException("페이지 사이즈가 올바르지 않습니다.");

        // 정렬 옵션 기본값 및 검증
        if (sort == null || sort.isEmpty()) sort = "like_count";
        if (!sort.equals("latest") && !sort.equals("rating") && !sort.equals("like_count")) {
            throw new WrongRequestException("정렬 옵션이 올바르지 않습니다.");
        }

        // N+1 조회 (다음 페이지 확인용으로 1개 더 가져옴)
        int limit = size + 1;
        int offset = (page - 1) * size;

        try {
            // Mapper 호출 (size 자리에 limit(9개)를 넘김)
            List<ReviewDTO> reviews = reviewMapper.selectReviewList(offset, limit, sort, category);

            // 다음 페이지 여부 확인 ex:9개
            boolean hasNext = false;
            if (reviews.size() > size) {
                hasNext = true;        // 9개가 왔으니 다음 페이지 있음
                reviews.remove(size);  // 9번째 데이터는 확인했으니 삭제 (8개만 남김)
            }

            // 결과 포장 및 반환
            return PageResponse.<ReviewDTO>builder()
                    .content(reviews)
                    .hasNext(hasNext) // 프론트는 이 값을 보고 버튼 활성화 결정
                    .page(page)
                    .size(size)
                    .build();

        } catch (DataAccessException e) {
            throw new DatabaseException("리뷰 목록 조회 중 DB 오류가 발생했습니다.", e);
        }
    }
}