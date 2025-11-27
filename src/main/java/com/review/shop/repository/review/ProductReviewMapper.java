package com.review.shop.repository.review;

import com.review.shop.dto.review.BestReviewDTO;
import com.review.shop.dto.review.ProductReviewDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductReviewMapper {

    Integer selectProductById(@Param("product_id") int product_id);


    /**
     * 특정 상품의 리뷰 목록 조회 (이미지 포함)
     */
    List<ProductReviewDTO> selectReviewsByProduct(
            @Param("product_id") int product_id,
            @Param("sort") String sort
    );

    /**
     * 리뷰 생성
     */
    int insertReview(
            @Param("product_id") int product_id,
            @Param("user_id") int user_id,
            @Param("content") String content,
            @Param("rating") double rating,
            @Param("order_item_id") int order_item_id
    );

    // 리뷰 이미지 저장
    void insertReviewImage(
            @Param("review_id") int review_id,
            @Param("imageUrl") String imageUrl
    );

    // 가장 최근 생성된 리뷰 조회(윤성님)
    ProductReviewDTO selectLastReview(
            @Param("product_id") int product_id,
            @Param("user_id") int user_id
    );

    // 리뷰 아이디로 조회
    ProductReviewDTO selectReviewById(@Param("review_id")int review_id);


    // 리뷰 수정
    int updateReview(@Param("review_id") int review_id,
                     @Param("content") String content,
                     @Param("rating") double rating);

    // 기존 리뷰 이미지 삭제
    void deleteReviewImagesByReviewId(@Param("review_id") int review_id);

    // 리뷰 삭제
    void deleteReview(@Param("review_id")int review_id);

    // 베스트 리뷰 선정용
    List<BestReviewDTO> selectBestReviewIds();

}