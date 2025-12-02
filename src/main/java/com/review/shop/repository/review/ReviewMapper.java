package com.review.shop.repository.review;

import com.review.shop.dto.review.ReviewDTO;
import com.review.shop.dto.review.ReviewDetailResponseDTO;
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

    // 리뷰 기본 정보 조회
    ReviewDetailResponseDTO.ReviewDetailDTO getReviewBase(int review_id);

    // 상품 정보 조회
    ReviewDetailResponseDTO.ProductInfoDTO getProductByReviewId(int review_id);

    // 리뷰 이미지 리스트 조회
    List<String> getReviewImages(int review_id);

    // 댓글 목록 조회
    List<ReviewDetailResponseDTO.CommentDTO> getComments(int review_id);

    // 유저 반응(좋아요/싫어요) 조회
    String getUserReaction(@Param("review_id") int review_id, @Param("user_id") int user_id);
}