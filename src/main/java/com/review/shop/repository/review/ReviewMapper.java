package com.review.shop.repository.review;

import com.review.shop.dto.review.ReviewDTO;
import com.review.shop.dto.review.ReviewDetailResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReviewMapper {


    List<ReviewDTO> selectReviewList(
            @Param("sort") String sort,
            @Param("category") String category,
            @Param("offset") int offset,
            @Param("size") int size
    );

    ReviewDetailResponseDTO.ReviewDetailDTO getReviewBase(int review_id);

    ReviewDetailResponseDTO.ProductInfoDTO getProductByReviewId(int review_id);

    List<String> getReviewImages(int review_id);

    List<ReviewDetailResponseDTO.CommentDTO> getComments(int review_id);

    String getUserReaction(@Param("review_id") int review_id, @Param("user_id") int user_id);
}