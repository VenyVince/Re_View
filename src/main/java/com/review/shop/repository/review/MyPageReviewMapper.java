package com.review.shop.repository.review;

import com.review.shop.dto.review.MyPageReviewResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MyPageReviewMapper {
    List<MyPageReviewResponseDTO> SearchMyReviews(@Param("user_id") int user_id,
                                                  @Param("keyword")  String keyword,
                                                  @Param("sort") String sort,
                                                  @Param("filter_rating") float filter_rating);
}
