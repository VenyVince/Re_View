package com.review.shop.repository.recommendations;

import com.review.shop.dto.product.ProductDTO;
import com.review.shop.dto.product.RecommendationDTO;
import com.review.shop.dto.recommendations.RecommendationAdminPickDTO;
import com.review.shop.dto.recommendations.RecommendationsUserDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface RecommendationsMapper {
    /**
     * 바우만 피부 타입에 따른 상품 추천 리스트 조회
     * @param first  D or O
     * @param second S or R
     * @param third  P or N
     * @param fourth W or T
     */
    List<ProductDTO> findRecommendProducts(
            @Param("first") String first,
            @Param("second") String second,
            @Param("third") String third,
            @Param("fourth") String fourth
    );

    //사용자의 세션에 따라 바우만 아이디 가져오기
    Integer getBaumannTypeByUserId(@Param("user_id") int user_id);

    //가져온 바우만 아이디를 기반으로 바우만 타입(first, second, third, fourth) 가져오기
    RecommendationsUserDTO getBaumannDTOWithId(@Param("user_Baumann") Integer user_Baumann);

    // 바우만 타입으로 비교하여 추천 상품 리스트를 리턴
    List<RecommendationDTO> findRecommencementsWithAll(@Param("userInfo") List<String> userInfo);

    List<RecommendationDTO> findRecommencementsWithFirst(@Param("userInfo") List<String> userInfo);

    List<RecommendationDTO> findRecommencementsWithSecond(@Param("userInfo") List<String> userInfo);

    List<RecommendationDTO> findRecommencementsWithThird(@Param("userInfo") List<String> userInfo);

    List<RecommendationDTO> findRecommencementsWithFourth(@Param("userInfo") List<String> userInfo);

    List<RecommendationAdminPickDTO> getRandomRecommendationAdminPicks();
}
