package com.review.shop.repository.search.MyPagenProductPage;

import com.review.shop.dto.search.MyPagenProductPage.MyPage.MyPageReviewDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MyPageReviewMapper {
    List<MyPageReviewDTO> SearchMyReviews(@Param("user_id") int user_id,
                                          @Param("keyword")  String keyword,
                                          @Param("sort") String sort,
                                          @Param("filter_rating") float filter_rating);
}
