package com.review.shop.repository.admin;

import com.review.shop.dto.ProductDetailDTO;
import org.apache.ibatis.annotations.Mapper; // 👈 추가
import org.apache.ibatis.annotations.Param; // 👈 추가

import java.util.List;

@Mapper
public interface AdminMapper {
    //    상품
    //상품 등록
    int insertProduct(ProductDetailDTO product);

    //상품 수정
    int updateProduct(@Param("productId") int productId,
                      @Param("product") ProductDetailDTO product);

    //상품 삭제
    int deleteProduct(int productId);

    //    주문
    //주문 상태 변경
    int updateOrderStatus(@Param("orderId") int orderId,
                          @Param("orderStatus") String orderStatus);

    //    QnA
    //QnA 답변 업뎃
    int updateQnaAnswer(@Param("qnaId") int qnaId,
                        @Param("adminAnswer") String adminAnswer);

    //    포인트
    //포인트 조회
    Integer getMemberPoints(int memberId);

    List<ProductDetailDTO> getAllProducts();

    //리뷰 소프트 삭제
    int deleteReview(int reviewId);

    //운영자 리뷰 선택 여부 설정, isSelected는 can null
    int setReviewSelection(int reviewId, Integer isSelected);
}