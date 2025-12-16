package com.review.shop.service.review;

import com.review.shop.dto.review.ReviewDTO;
import com.review.shop.dto.review.ReviewDetailResponseDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.image.ImageService;
import com.review.shop.repository.review.ReviewMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewMapper reviewMapper;
    private final ImageService imageService;

    // Service
    public List<ReviewDTO> getReviewList(String sort, String category, int page, int size) {
        if (sort == null || sort.isEmpty()) sort = "latest";

        try {

            // offset 계산, 2페이지면 200개의 리뷰를 건너뛰어야하므로.
            int offset = page * size;

            List<ReviewDTO> reviews = reviewMapper.selectReviewList(sort, category, offset, size);

            // 이미지 Presigned URL 처리
            reviews.forEach(review -> {
                if (review.getImage_url() != null && !review.getImage_url().isEmpty()) {
                    review.setImage_url(imageService.presignedUrlGet(review.getImage_url()));
                }
                if (review.getProduct_image() != null && !review.getProduct_image().isEmpty()) {
                    review.setProduct_image(imageService.presignedUrlGet(review.getProduct_image()));
                }
            });

            return reviews;

        } catch (DataAccessException e) {
            throw new DatabaseException("리뷰 목록 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 리뷰 상세 조회
    public ReviewDetailResponseDTO getReviewDetail(int review_id, int user_id) {
        // 리뷰 기본 정보 가져오기
        ReviewDetailResponseDTO.ReviewDetailDTO reviewDTO = reviewMapper.getReviewBase(review_id);

        if (reviewDTO == null) {
            throw new ResourceNotFoundException("리뷰를 찾을 수 없습니다.");
        }

        // 상품 정보 가져오기 (상품 썸네일 포함)
        ReviewDetailResponseDTO.ProductInfoDTO productDTO = reviewMapper.getProductByReviewId(review_id);

        // 상품 이미지 Key -> URL 변환
        if (productDTO != null && productDTO.getProduct_image() != null && !productDTO.getProduct_image().isEmpty()) {
            String productImageUrl = imageService.presignedUrlGet(productDTO.getProduct_image());
            productDTO.setProduct_image(productImageUrl);
        }

        // 리뷰 이미지 리스트 가져오기
        List<String> imageKeys = reviewMapper.getReviewImages(review_id);

        // 리뷰 이미지 리스트 Keys -> URLs 변환
        List<String> imageUrls = new ArrayList<>();
        if (imageKeys != null && !imageKeys.isEmpty()) {
            imageUrls = imageKeys.stream()
                    .map(key -> imageService.presignedUrlGet(key)) // ImageService 호출
                    .collect(Collectors.toList());
        }
        reviewDTO.setImages(imageUrls);

        // 댓글 가져오기
        List<ReviewDetailResponseDTO.CommentDTO> comments = reviewMapper.getComments(review_id);

        // 좋아요/싫어요 여부 확인
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