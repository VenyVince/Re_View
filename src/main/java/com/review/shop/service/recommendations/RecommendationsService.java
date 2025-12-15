package com.review.shop.service.recommendations;

import com.review.shop.dto.recommendations.*;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.image.ImageService;
import com.review.shop.repository.recommendations.RecommendationsMapper;
import com.review.shop.util.Security_Util;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationsService {

    private final RecommendationsMapper recommendationsMapper;
    private final Security_Util security_util;
    private final ImageService imageService;

    // 사용자의 바우만 타입 체크
    public Integer getBaumannTypeByUserId() {
        Integer baumannId =
                recommendationsMapper.getBaumannTypeByUserId(security_util.getCurrentUserId());

        if (baumannId == null) {
            throw new ResourceNotFoundException("해당 사용자의 바우만 타입이 존재하지 않습니다.");
        }
        return baumannId;
    }

    public BaumannDTO getBaumannDTOWithId(Integer baumann_id) {
        BaumannDTO dto =
                recommendationsMapper.getBaumannDTOWithId(baumann_id);
        if (dto == null) {
            throw new ResourceNotFoundException("해당 바우만 타입이 존재하지 않습니다.");
        }
        return dto;
    }

    // 추천 로직
    public RecommendationResponseDTO getRecommendations(BaumannDTO baumannDTO) {

        List<String> userInfo = List.of(
                baumannDTO.getFirst(),
                baumannDTO.getSecond(),
                baumannDTO.getThird(),
                baumannDTO.getFourth()
        );

        List<RecommendProductDTO> products =
                recommendationsMapper.findRecommendProducts(userInfo);

        List<RecommendReviewDTO> reviews =
                recommendationsMapper.findRecommendReviews(userInfo);

        if (products.isEmpty() && reviews.isEmpty()) {
            throw new ResourceNotFoundException("추천 결과가 없습니다.");
        }

        // 상품 이미지 presignedURL 변환
        for (RecommendProductDTO p : products) {
            if (p.getProduct_image_url() != null && !p.getProduct_image_url().isEmpty()) {
                p.setProduct_image_url(
                        imageService.presignedUrlGet(p.getProduct_image_url())
                );
            }
        }

        // 리뷰 이지미 presignedURL 변환
        for (RecommendReviewDTO r : reviews) {
            if (r.getReview_image_url() != null && !r.getReview_image_url().isEmpty()) {
                r.setReview_image_url(
                        imageService.presignedUrlGet(r.getReview_image_url())
                );
            }
        }

        RecommendationResponseDTO response = new RecommendationResponseDTO();
        response.setProducts(products.stream().limit(16).toList());
        response.setReviews(reviews.stream().limit(16).toList());
        return response;
    }

    // 관리자픽 로직
    public RecommendationAdminPickDTO getRandomRecommendationAdminPicks() {
        RecommendationAdminPickDTO result =
                recommendationsMapper.getRandomRecommendationAdminPicks();

        result.setThumbnail_url(
                imageService.presignedUrlGet(result.getThumbnail_url())
        );

        return result;
    }
}
