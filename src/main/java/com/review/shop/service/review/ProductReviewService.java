package com.review.shop.service.review;

import com.review.shop.dto.review.BestReviewDTO;
import com.review.shop.dto.review.ProductReviewDTO;
import com.review.shop.dto.review.review_create.CreateReviewRequestDTO;
import com.review.shop.dto.review.review_create.CreateReviewResponseDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.OrderItemIdMapper;
import com.review.shop.repository.review.ProductReviewMapper;
import com.review.shop.service.userinfo.other.PointService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductReviewService {

    private final ProductReviewMapper productReviewMapper;
    private final OrderItemIdMapper orderItemIdMapper;
    private final PointService pointService;

    public boolean canCreate(int order_item_id, int user_id) {
        // 1. order_item_id 실존 여부 체크 (해당 유저의 주문인지도 확인)
        Integer exists = orderItemIdMapper.existsOrderItem(order_item_id, user_id);
        if (exists == null || exists == 0) {
            System.out.println("order_item_id(주문내역)가 존재하지 않습니다.");
            return false;
        }

        // 2. 이미 리뷰가 작성되었는지 체크
        Integer reviewExists = orderItemIdMapper.checkReviewByOrderItemId(order_item_id);
        if (reviewExists != null && reviewExists > 0) {
            System.out.println("해당 order_item_id(주문내역)로 작성된 리뷰가 이미 존재합니다.");
            return false;
        }
        // 위 조건을 모두 통과하면 작성 가능
        return true;
    }

    // 리뷰에 대한 내용만 검증( 상품은 아래 삭제쪽이나 수정쪽에서 직접 검증)
    public boolean canUpdate(int review_id, int user_id) {

        // 1. 리뷰 존재 여부 체크
        ProductReviewDTO review = productReviewMapper.selectReviewById(review_id);
        if (review == null) {
            System.out.println("존재하지 않는 리뷰입니다.");
            return false;
        }

        if (review.getUser_id() != user_id) {
            System.out.println("본인의 리뷰만 수정할 수 있습니다");
            return false;
        }

        if (review.getLike_count() >= 100){
            System.out.println("리뷰의 추천이 100개 이상입니다.");
            return false;
        }
        if(review.getIs_selected() >=1){
            System.out.println("운영자 채택 리뷰 입니다.");
            return false;
        }

        // 모든 조건을 통과하면 수정 가능
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
            List<String> imageUrls,
            int order_item_id
    ) {

        // 유효성 검사
        if (content == null || content.trim().isEmpty()) throw new WrongRequestException("리뷰 내용이 필수입니다");
        if (content.length() > 1000) throw new WrongRequestException("리뷰 내용은 1000자 이하여야 합니다");
        if (rating < 1 || rating > 5) throw new WrongRequestException("평점은 1~5 사이여야 합니다");
        else System.out.println(1);

        // 리뷰 생성
        int insertedRows = productReviewMapper.insertReview(product_id, user_id, content, rating, order_item_id);
        if (insertedRows != 1) throw new DatabaseException("리뷰 생성 실패");

        System.out.println(2);
        // 생성된 리뷰 조회
        ProductReviewDTO createdReview = productReviewMapper.selectLastReview(product_id, user_id);
        if (createdReview == null) throw new DatabaseException("생성된 리뷰 조회 실패");

        System.out.println(3);
        // 이미지 저장 (imageUrls는 ImageUploadController(ImageUploadController에서는 multipartfile로 받음.)에서 받은 URL 리스트)
        if (imageUrls != null && !imageUrls.isEmpty()) {
            for (String imageUrl : imageUrls) {
                productReviewMapper.insertReviewImage(createdReview.getReview_id(), imageUrl);
            }
        }

        System.out.println(4);
        // 이미지 배열 설정
        createdReview.setImages(imageUrls != null ? imageUrls : new ArrayList<>());

        System.out.println(5);
        return createdReview;
    }

    @Transactional
    // 리뷰 작성
    public CreateReviewResponseDTO createReviewWithReward(
            int product_id,
            int user_id,
            CreateReviewRequestDTO request
    ) {
        if(!canCreate(request.getOrder_item_id(), user_id)) {
            // 보안상 생성시에도 확인
            throw new WrongRequestException("잘못된 접근입니다.");
        }

        // 리뷰 작성
        ProductReviewDTO review = createReview(
                product_id,
                user_id,
                request.getContent(),
                request.getRating(),
                request.getImageUrls(),
                request.getOrder_item_id()
        );
        // 응답 DTO 구성
        CreateReviewResponseDTO response = new CreateReviewResponseDTO();
        response.setReview_id(review.getReview_id());
        response.setContent(review.getContent());
        response.setRating(review.getRating());
        response.setImageUrls(request.getImageUrls());
        response.setPointsEarned(PointService.PointConstants.CreateREVIEW);
        Integer review_id = review.getReview_id();
        // 포인트 적립
        pointService.addReviewPoint(user_id, review_id);
        return response;
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

        // 포인트 회수 (삭제된 리뷰에 대해 적립된 포인트 차감)
        pointService.removeReviewPoint(user_id, review_id);
    }

    // 베스트 리뷰 조회
    public List<BestReviewDTO> selectBestReviewList() {
        return productReviewMapper.selectBestReviewIds();
    }

    // 스케쥴러에서 베스트 리뷰 갱신 엔트리포인트
    @Transactional
    public void updateBestReviews() {
        // 1. 기존 베스트 리뷰 초기화
        productReviewMapper.resetBestReviews();

        // 2. 새 베스트 리뷰 조회
        List<BestReviewDTO> bestList = productReviewMapper.selectBestReviewIds();

        // 3. 조회된 리뷰 is_checked 업데이트
        List<Integer> review_ids = bestList.stream()
                .map(BestReviewDTO::getReview_id)
                .collect(Collectors.toList());
        if (!review_ids.isEmpty()) {
            productReviewMapper.updateBestReviews(review_ids);
        }

        // 4. 포인트 지급
        for (BestReviewDTO dto : bestList) {
            pointService.addBestReviewPoint(dto.getUser_id(), dto.getReview_id());
            dto.setIs_checked(1); // DTO와 DB 동기화
        }
    }

}