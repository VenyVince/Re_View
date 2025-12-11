package com.review.shop.service.review;

import com.review.shop.dto.review.ReviewDTO;
import com.review.shop.dto.review.ReviewDetailResponseDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.image.ImageService;
import com.review.shop.repository.review.ReviewMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewMapper reviewMapper;
    private final ImageService imageService;

    // page, size 매개변수 제거
    public List<ReviewDTO> getReviewList(String sort, String category) {

        // 정렬 옵션 기본값 및 검증
        if (sort == null || sort.isEmpty()) sort = "like_count";
        if (!sort.equals("latest") && !sort.equals("rating") && !sort.equals("like_count")) {
            throw new WrongRequestException("정렬 옵션이 올바르지 않습니다.");
        }

        try {
            // Mapper 호출 (offset, size 없이 호출)
            List<ReviewDTO> reviews = reviewMapper.selectReviewList(sort, category);

            // 이미지 Presigned URL 처리
            reviews.forEach(product -> {
                if (product.getImage_url() != null && !product.getImage_url().isEmpty()) {
                    String presignedUrl = imageService.presignedUrlGet(product.getImage_url());
                    product.setImage_url(presignedUrl);
                }
            });

            return reviews;

        } catch (DataAccessException e) {
            throw new DatabaseException("리뷰 목록 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    public ReviewDetailResponseDTO getReviewDetail(int review_id, int user_id) {
        ReviewDetailResponseDTO.ReviewDetailDTO reviewDTO = reviewMapper.getReviewBase(review_id);

        if (reviewDTO == null) {
            throw new ResourceNotFoundException("리뷰를 찾을 수 없습니다.");
        }

        ReviewDetailResponseDTO.ProductInfoDTO productDTO = reviewMapper.getProductByReviewId(review_id);
        List<String> images = reviewMapper.getReviewImages(review_id);
        reviewDTO.setImages(images);

        List<ReviewDetailResponseDTO.CommentDTO> comments = reviewMapper.getComments(review_id);

        if (user_id > 0) {
            String reaction = reviewMapper.getUserReaction(review_id, user_id);
            boolean isLiked = "1".equals(reaction);
            boolean isDisliked = "0".equals(reaction);

            reviewDTO.setUser_liked(isLiked);
            reviewDTO.setUser_disliked(isDisliked);
        } else {
            reviewDTO.setUser_liked(false);
            reviewDTO.setUser_disliked(false);
        }

        return ReviewDetailResponseDTO.builder()
                .review(reviewDTO)
                .product(productDTO)
                .comments(comments)
                .build();
    }
}