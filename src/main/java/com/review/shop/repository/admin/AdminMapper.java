package com.review.shop.repository.admin;

import com.review.shop.dto.product.ProductDetailDTO;
import com.review.shop.dto.qna.QnaDTO;
import com.review.shop.dto.qna.QnAListDTO;
import com.review.shop.dto.user.UserSummaryDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminMapper {
    //    상품
    //상품 등록
    int insertProduct(ProductDetailDTO product);

    //상품 수정
    int updateProduct(@Param("product_id") int product_id,
                      @Param("product") ProductDetailDTO product);

    //상품 삭제
    int deleteProduct(int product_id);

    //    주문
    //주문 상태 변경
    int updateOrderStatus(@Param("order_id") int order_id,
                          @Param("orderStatus") String orderStatus);

    //    QnA
    //QnA 답변 업뎃
    int updateQnaAnswer(@Param("qna_id") int qna_id,
                        @Param("adminAnswer") String adminAnswer);

    //    포인트
    //포인트 조회
    Integer getMemberPoints(int member_id);

    List<ProductDetailDTO> getAllProducts();

    //리뷰 소프트 삭제
    int deleteReview(int review_id);

    //운영자 리뷰 선택 여부 설정, is_selected는 can null
    int setReviewSelection(int review_id, Integer is_selected);

    // QnA 전체 조회
    List<QnAListDTO> getAllQna();

    // QnA  상세보기
    QnaDTO getQnaDetail(int qna_id);

    int updateMemberPoints(@Param("user_id") int user_id, @Param("points") Integer points);

    ProductDetailDTO readProduct(int product_id);

    int insertProductImage(@Param("product_id") int product_id, @Param("image") String image);

    List<String> readImage(int product_id);

    List<UserSummaryDTO> getAllusers();

    int setBlacklist(@Param("user_id") int user_id, @Param("reason") String reason);

    int deleteUser(@Param("user_id") int user_id);
}