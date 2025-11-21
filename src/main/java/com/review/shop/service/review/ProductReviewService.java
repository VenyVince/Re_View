package com.review.shop.service.review;

import com.review.shop.dto.review.ProductReviewDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.product.ProductReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductReviewService {

    private final ProductReviewMapper productReviewMapper;

    
    // 분기점 확인
    public boolean hasUserReviewed(int product_id, int user_id) {
        List<ProductReviewDTO> reviews = productReviewMapper.selectReviewsByProductAndUser(product_id, user_id);
        return reviews != null && !reviews.isEmpty();
    }

    /**
     * 특정 상품의 리뷰 목록 조회
     */
    public List<ProductReviewDTO> getProductReviews(int product_id, String sort) {

        // 상품 존재 여부 체크
        if (productReviewMapper.selectProductById(product_id) == null) {
            throw new WrongRequestException("존재하지 않는 상품입니다");
        }
        // 정렬 옵션 검증
        if (sort == null || sort.isEmpty() || (!sort.equals("like_count") && !sort.equals("latest") && !sort.equals("rating"))) {
            sort = "like_count";
        }
        // DB에서 조회
        List<ProductReviewDTO> reviewsWithImages = productReviewMapper.selectReviewsByProduct(product_id, sort);
        // 리뷰를 review_id로 그룹핑해서 이미지 배열 생성
        Map<Integer, ProductReviewDTO> groupedReviews = new LinkedHashMap<>();
        for (ProductReviewDTO review : reviewsWithImages) {
            groupedReviews.putIfAbsent(review.getReview_id(), review);
            // 이미지가 있으면 배열에 추가
            if (review.getImage_url() != null && !review.getImage_url().isEmpty()) {
                groupedReviews.get(review.getReview_id()).getImages().add(review.getImage_url());
            }
        }
        return new ArrayList<>(groupedReviews.values());
    }

    /**
     * 리뷰 생성
     * user_id를 직접 받음 (세션에서 가져온 값)
     */
    public ProductReviewDTO createReview(
            int product_id,
            int user_id,  // ← DB 컬럼명 스타일 유지
            String content,
            double rating,
            List<String> imageUrls
    ) {

        // 유효성 검사
        if (content == null || content.trim().isEmpty()) throw new WrongRequestException("리뷰 내용이 필수입니다");
        if (content.length() > 1000) throw new WrongRequestException("리뷰 내용은 1000자 이하여야 합니다");
        if (rating < 1 || rating > 5) throw new WrongRequestException("평점은 1~5 사이여야 합니다");

        // 리뷰 생성
        int insertedRows = productReviewMapper.insertReview(product_id, user_id, content, rating);
        if (insertedRows != 1) throw new DatabaseException("리뷰 생성 실패");

        // 생성된 리뷰 조회
        ProductReviewDTO createdReview = productReviewMapper.selectLastReview(product_id, user_id);
        if (createdReview == null) throw new DatabaseException("생성된 리뷰 조회 실패");

        // 이미지 저장 (imageUrls는 ImageUploadController(ImageUploadController에서는 multipartfile로 받음. 33번 라인 확인)에서 받은 URL 리스트)
        if (imageUrls != null && !imageUrls.isEmpty()) {
            for (String imageUrl : imageUrls) {
                productReviewMapper.insertReviewImage(createdReview.getReview_id(), imageUrl);
            }
        }

        // 이미지 배열 설정
        createdReview.setImages(imageUrls != null ? imageUrls : new ArrayList<>());

        return createdReview;
    }

    // 리부수정
    public ProductReviewDTO updateReview(
            int review_id,
            int user_id,
            String content,
            double rating,
            List<String> imageUrls
    ) {
        // 리뷰 존재 여부 확인
        ProductReviewDTO review = productReviewMapper.selectReviewById(review_id);
        if (review == null) {
            throw new WrongRequestException("존재하지 않거나 삭제된 리뷰입니다");
        }

        // 작성자 확인
        if (review.getUser_id() != user_id) {
            throw new WrongRequestException("본인의 리뷰만 수정할 수 있습니다");
        }

        // 유효성 검사
        if (content == null || content.trim().isEmpty()) throw new WrongRequestException("리뷰 내용이 필수입니다");
        if (content.length() > 1000) throw new WrongRequestException("리뷰 내용은 1000자 이하여야 합니다");
        if (rating < 1 || rating > 5) throw new WrongRequestException("평점은 1~5 사이여야 합니다");

        // 리뷰 수정
        int updatedRows = productReviewMapper.updateReview(review_id, content, rating);
        if (updatedRows != 1) throw new DatabaseException("리뷰 수정 실패");

        // 기존 이미지 삭제 후 새로운 이미지 삽입
        productReviewMapper.deleteReviewImagesByReviewId(review_id);
        if (imageUrls != null && !imageUrls.isEmpty()) {
            for (String imageUrl : imageUrls) {
                productReviewMapper.insertReviewImage(review_id, imageUrl);
            }
        }

        // 수정된 리뷰 조회
        ProductReviewDTO updatedReview = productReviewMapper.selectReviewById(review_id);
        updatedReview.setImages(imageUrls != null ? imageUrls : new ArrayList<>());

        return updatedReview;
    }

    
    /**
     * 리뷰 삭제 (Soft Delete)
     */
    public void deleteReview(int product_id, int user_id,  int review_id) {

        // 상품 존재 여부
        int productExists = productReviewMapper.selectProductById(product_id);
        if (productExists == 0) {
            throw new WrongRequestException("존재하지 않는 상품입니다");
        }
        // 리뷰 존재 여부 확인
        ProductReviewDTO review = productReviewMapper.selectReviewById(review_id);

        if (review == null) throw new WrongRequestException("이미 삭제된 리뷰거나 존재하지 않는 리뷰입니다");

        // 삭제 권한 확인 (본인만 삭제할 수 있게)
        if (review.getUser_id() != user_id) {
            throw new WrongRequestException("본인의 리뷰만 삭제할 수 있습니다. 작성자 ID: " + review.getUser_id());
        }
        // 삭제 (Soft Delete - deleted_at 업데이트)
        productReviewMapper.deleteReview(review_id);
    }
}