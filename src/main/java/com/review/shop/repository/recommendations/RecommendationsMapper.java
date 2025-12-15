package com.review.shop.repository.recommendations;

import com.review.shop.dto.recommendations.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface RecommendationsMapper {

    /* ==========================
       바우만 타입
       ========================== */

    Integer getBaumannTypeByUserId(@Param("user_id") int user_id);

    BaumannDTO getBaumannDTOWithId(
            @Param("user_Baumann") Integer user_Baumann
    );

    /* ==========================
       추천 쿼리
       ========================== */

    // 상품 추천
    List<RecommendProductDTO> findRecommendProducts(
            @Param("userInfo") List<String> userInfo
    );

    // 리뷰 추천
    List<RecommendReviewDTO> findRecommendReviews(
            @Param("userInfo") List<String> userInfo
    );

    /* ==========================
       관리자 추천
       ========================== */

    RecommendationAdminPickDTO getRandomRecommendationAdminPicks();
}
