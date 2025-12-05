package com.review.shop.service.review;

import com.review.shop.dto.review.BestReviewDTO;
import com.review.shop.dto.review.ProductReviewDTO;
import com.review.shop.dto.review.review_create.CreateReviewRequestDTO;
import com.review.shop.dto.review.review_create.CreateReviewResponseDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.image.ImageService; // [추가]
import com.review.shop.repository.OrderItemIdMapper;
import com.review.shop.repository.review.ProductReviewMapper;
import com.review.shop.service.userinfo.other.PointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductReviewService {

    private final ProductReviewMapper productReviewMapper;
    private final OrderItemIdMapper orderItemIdMapper;
    private final PointService pointService;
    private final ImageService imageService; // [추가] 이미지 처리 담당

    public boolean canCreate(int order_item_id, int user_id) {
        // 1. order_item_id 실존 여부 체크 (해당 유저의 주문인지도 확인)
        Integer exists = orderItemIdMapper.existsOrderItem(order_item_id, user_id);
        if (exists == null || exists == 0) {
            return false;
        }

        // 2. 이미 리뷰가 작성되었는지 체크
        Integer reviewExists = orderItemIdMapper.checkReviewByOrderItemId(order_item_id);
        if (reviewExists != null && reviewExists > 0) {
            return false;
        }
        return true;
    }

    // 리뷰 수정/삭제 권한 체크
    public boolean canUpdate(int review_id, int user_id) {
        ProductReviewDTO review = productReviewMapper.selectReviewById(review_id);
        if (review == null) return false;
        if (review.getUser_id() != user_id) return false;
        if (review.getLike_count() >= 100) return false;
        if (review.getIs_selected() >= 1) return false;

        return true;
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

        // DB에서 조회 (image_url에는 Object Key가 들어있음)
        List<ProductReviewDTO> reviewsWithImages = productReviewMapper.selectReviewsByProduct(product_id, sort);

        // 리뷰를 review_id로 그룹핑해서 이미지 배열 생성
        Map<Integer, ProductReviewDTO> groupedReviews = new LinkedHashMap<>();
        for (ProductReviewDTO review : reviewsWithImages) {
            groupedReviews.putIfAbsent(review.getReview_id(), review);

            // [변경] 이미지가 있으면 Key를 URL로 변환하여 추가
            String objectKey = review.getImage_url();
            if (objectKey != null && !objectKey.isEmpty()) {
                String presignedUrl = imageService.presignedUrlGet(objectKey); // Key -> URL 변환
                groupedReviews.get(review.getReview_id()).getImages().add(presignedUrl);
            }
        }
        return new ArrayList<>(groupedReviews.values());
    }

    /**
     * 리뷰 생성 (내부 호출용)
     */
    public ProductReviewDTO createReview(
            int product_id,
            int user_id,
            String content,
            double rating,
            List<String> objectKeys, // [변경] imageUrls -> objectKeys (의미 명확화)
            int order_item_id
    ) {

        // 유효성 검사
        if (content == null || content.trim().isEmpty()) throw new WrongRequestException("리뷰 내용이 필수입니다");
        if (content.length() > 1000) throw new WrongRequestException("리뷰 내용은 1000자 이하여야 합니다");
        if (rating < 1 || rating > 5) throw new WrongRequestException("평점은 1~5 사이여야 합니다");

        // 리뷰 내용 저장 (DB)
        int insertedRows = productReviewMapper.insertReview(product_id, user_id, content, rating, order_item_id);
        if (insertedRows != 1) throw new DatabaseException("리뷰 생성 실패");

        // 생성된 리뷰 조회
        ProductReviewDTO createdReview = productReviewMapper.selectLastReview(product_id, user_id);
        if (createdReview == null) throw new DatabaseException("생성된 리뷰 조회 실패");

        // [변경] 이미지 키 저장 (ImageService 위임)
        if (objectKeys != null && !objectKeys.isEmpty()) {
            imageService.saveReviewImageObjectKey(createdReview.getReview_id(), objectKeys);
        }

        // [변경] 응답용 URL 변환 (Key -> URL)
        List<String> imageUrls = new ArrayList<>();
        if (objectKeys != null) {
            imageUrls = objectKeys.stream()
                    .map(key -> imageService.presignedUrlGet(key))
                    .collect(Collectors.toList());
        }
        createdReview.setImages(imageUrls);

        return createdReview;
    }

    @Transactional
    // 리뷰 작성 (진입점)
    public CreateReviewResponseDTO createReviewWithReward(
            int product_id,
            int user_id,
            CreateReviewRequestDTO request
    ) {
        if(!canCreate(request.getOrder_item_id(), user_id)) {
            throw new WrongRequestException("잘못된 접근입니다.");
        }

        // 리뷰 작성
        ProductReviewDTO review = createReview(
                product_id,
                user_id,
                request.getContent(),
                request.getRating(),
                request.getImageUrls(), // 프론트에서 받은 Object Key 리스트
                request.getOrder_item_id()
        );

        // 응답 DTO 구성
        CreateReviewResponseDTO response = new CreateReviewResponseDTO();
        response.setReview_id(review.getReview_id());
        response.setContent(review.getContent());
        response.setRating(review.getRating());

        // [확인] 이미 변환된 URL 리스트가 들어감
        response.setImageUrls(review.getImages());

        response.setPointsEarned(PointService.PointConstants.CreateREVIEW);

        // 포인트 적립
        pointService.addReviewPoint(user_id, review.getReview_id());
        return response;
    }

    // 리뷰 수정
    public ProductReviewDTO updateReview(
            int review_id,
            int user_id,
            String content,
            double rating,
            List<String> objectKeys // [변경] 수정된 이미지 키 리스트
    ) {
        // 리뷰 존재 여부 확인
        ProductReviewDTO review = productReviewMapper.selectReviewById(review_id);
        if (review == null) throw new WrongRequestException("존재하지 않는 리뷰입니다");

        // 유효성 검사
        if (content == null || content.trim().isEmpty()) throw new WrongRequestException("리뷰 내용이 필수입니다");
        if (rating < 1 || rating > 5) throw new WrongRequestException("평점은 1~5 사이여야 합니다");

        // 리뷰 내용 수정
        int updatedRows = productReviewMapper.updateReview(review_id, content, rating);
        if (updatedRows != 1) throw new DatabaseException("리뷰 수정 실패");

        // [변경] 이미지 갱신 로직 (삭제 후 재저장 -> ImageService 위임)
        productReviewMapper.deleteReviewImagesByReviewId(review_id); // 기존 매핑 삭제

        if (objectKeys != null && !objectKeys.isEmpty()) {
            imageService.saveReviewImageObjectKey(review_id, objectKeys); // 새 키 저장
        }

        // 수정된 리뷰 조회 및 URL 변환
        ProductReviewDTO updatedReview = productReviewMapper.selectReviewById(review_id);

        List<String> imageUrls = new ArrayList<>();
        if (objectKeys != null) {
            imageUrls = objectKeys.stream()
                    .map(key -> imageService.presignedUrlGet(key)) // URL 변환
                    .collect(Collectors.toList());
        }
        updatedReview.setImages(imageUrls);

        return updatedReview;
    }

    @Transactional
    public void deleteReviewWithPenalty(int product_id, int user_id, int review_id) {
        // 상품 존재 여부 확인
        int productExists = productReviewMapper.selectProductById(product_id);
        if (productExists == 0) {
            throw new WrongRequestException("더이상 존재하지 않는 상품입니다");
        }

        // 리뷰 존재 여부 확인
        ProductReviewDTO review = productReviewMapper.selectReviewById(review_id);
        if (review == null) {
            throw new WrongRequestException("존재하지 않거나 이미 삭제된 리뷰입니다");
        }

        // 작성자 확인
        if (review.getUser_id() != user_id) {
            throw new WrongRequestException("본인의 리뷰만 삭제할 수 있습니다");
        }

        // Soft Delete
        productReviewMapper.deleteReview(review_id);

        // 포인트 회수
        pointService.removeReviewPoint(user_id, review_id);
    }

    // 베스트 리뷰 조회 (이미지 필요 시 변환 로직 추가 가능)
    public List<BestReviewDTO> selectBestReviewList() {
        return productReviewMapper.selectBestReviewIds();
    }

    // 스케쥴러용 베스트 리뷰 갱신
    @Transactional
    public void updateBestReviews() {
        productReviewMapper.resetBestReviews();
        List<BestReviewDTO> bestList = productReviewMapper.selectBestReviewIds();

        List<Integer> review_ids = bestList.stream()
                .map(BestReviewDTO::getReview_id)
                .collect(Collectors.toList());

        if (!review_ids.isEmpty()) {
            productReviewMapper.updateBestReviews(review_ids);
        }

        for (BestReviewDTO dto : bestList) {
            pointService.addBestReviewPoint(dto.getUser_id(), dto.getReview_id());
            // dto.setIs_checked(1); // 필요 시 사용
        }
    }
}