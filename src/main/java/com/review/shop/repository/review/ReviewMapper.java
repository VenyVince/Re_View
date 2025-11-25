package com.review.shop.repository.review;

import com.review.shop.dto.review.ReviewDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ReviewMapper {

    List<ReviewDTO> selectReviewList(
            @Param("offset") int offset, // 시작 위치
            @Param("size") int pageSize, // 페이지 당 개수
            @Param("sort") String sort, // 정렬 옵션 (latest, rating, like_count)
            @Param("category") String category
    );
}