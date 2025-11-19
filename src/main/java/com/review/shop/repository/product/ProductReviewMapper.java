package com.review.shop.repository.product;

import com.review.shop.dto.product.ProductReviewDTO;
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
            @Param("rating") double rating
    );

    /**
     * 리뷰 이미지 저장
     */
    int insertReviewImage(
            @Param("review_id") int review_id,
            @Param("imageUrl") String imageUrl
    );

    /**
     * 가장 최근 생성된 리뷰의 정보 조회
     */
    ProductReviewDTO selectLastReview(
            @Param("product_id") int product_id,
            @Param("user_id") int user_id
    );
    /**
     * 리뷰 ID로 조회
     */
    ProductReviewDTO selectReviewById(int review_id);

    /**
     * 리뷰 삭제 (Soft Delete)
     */
    void deleteReview(int review_id);
}