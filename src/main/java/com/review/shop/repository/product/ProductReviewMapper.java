package com.review.shop.repository.product;

import com.review.shop.dto.product.ProductReviewDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductReviewMapper {

    /**
     * 특정 상품의 리뷰 목록 조회 (이미지 포함)
     */
    List<ProductReviewDTO> selectReviewsByProduct(
            @Param("productId") int productId,
            @Param("sort") String sort
    );

    /**
     * 리뷰 생성
     */
    int insertReview(
            @Param("productId") int productId,
            @Param("userId") int userId,
            @Param("content") String content,
            @Param("rating") double rating
    );

    /**
     * 리뷰 이미지 저장
     */
    int insertReviewImage(
            @Param("reviewId") int reviewId,
            @Param("imageUrl") String imageUrl
    );

    /**
     * 가장 최근 생성된 리뷰의 정보 조회
     */
    ProductReviewDTO selectLastReview(
            @Param("productId") int productId,
            @Param("userId") int userId
    );
    /**
     * 리뷰 ID로 조회
     */
    ProductReviewDTO selectReviewById(int reviewId);

    /**
     * 리뷰 삭제 (Soft Delete)
     */
    void deleteReview(int reviewId);
}