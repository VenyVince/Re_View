package com.review.shop.service.admin;


import com.review.shop.dto.product.ProductDetailDTO;
import com.review.shop.dto.qna.QnAListDTO;
import com.review.shop.dto.qna.QnaDTO;
import com.review.shop.dto.user.UserSummaryDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.admin.AdminMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class AdminService {

    private final AdminMapper adminMapper;

    // 상품 등록
    public void insertProduct(ProductDetailDTO product) {
        if (product ==null){
            throw new WrongRequestException("상품 정보가 전달되지 않았습니다.");
        }
        int affected = adminMapper.insertProduct(product);
        if (affected == 0) {
            throw new DatabaseException("상품 등록에 실패했습니다.", null);
        }
    }

    // 상품 수정
    public void updateProduct(int product_id, ProductDetailDTO product) {
        if(product ==null){
            throw new WrongRequestException("수정할 상품 정보가 전달되지 않았습니다.");
        }
        int affected = adminMapper.updateProduct(product_id, product);
        if (affected == 0) {
            throw new ResourceNotFoundException("수정할 상품을 찾을 수 없습니다.");
        }
    }

    // 상품 삭제
    public void deleteProduct(int product_id) {
        int affected = adminMapper.deleteProduct(product_id);
        if (affected == 0) {
            throw new ResourceNotFoundException("삭제할 상품을 찾을 수 없습니다.");
        }
    }

    // 주문 상태 변경
    public void updateOrderStatus(int order_id, String orderStatus) {
        if(orderStatus ==null||orderStatus.isEmpty()){
            throw new WrongRequestException("변경할 주문 상태가 null이거나 존재하지 않습니다");

        }
        int affected = adminMapper.updateOrderStatus(order_id, orderStatus);
        if (affected == 0) {
            throw new ResourceNotFoundException("주문을 찾을 수 없습니다.");
        }
    }


    // QnA 답변 등록/수정
    public void updateQnaAnswer(int qna_id, String adminAnswer) {
        if(adminAnswer ==null||adminAnswer.isEmpty()){
            throw new WrongRequestException("답변 내용이 비어있습니다.");
        }
        int affected = adminMapper.updateQnaAnswer(qna_id, adminAnswer);
        if (affected == 0) {
            throw new ResourceNotFoundException("답변할 QnA를 찾을 수 없습니다.");
        }
    }

    // 포인트 조회
    public Integer getMemberPoints(int user_id) {
        Integer points = adminMapper.getMemberPoints(user_id);
        if (points == null) {
            throw new ResourceNotFoundException("포인트 정보를 찾을 수 없습니다.");
        }
        return points;
    }

    //getAllProducts
    public List<ProductDetailDTO> getAllProducts() {
        return adminMapper.getAllProducts();
    }

    //리뷰 삭제, 실제로 삭제 안하고 DELETED_DATE 플래그 설정
    public void deleteReview(int review_id) {
        int affected = adminMapper.deleteReview(review_id);
        if (affected == 0) {
            throw new ResourceNotFoundException("삭제할 리뷰를 찾을 수 없습니다.");
        }
    }

    //  setReviewSelection 구현 - 운영자 픽 설정 (테스트 완료)
    public void setReviewSelection(int review_id, Integer isSelected) {
        if (isSelected == null || (isSelected != 0 && isSelected != 1)) {
            throw new WrongRequestException("is_selected 값은 0 또는 1이어야 합니다.");
        }
        int affected = adminMapper.setReviewSelection(review_id, isSelected);
        if (affected == 0) {
            throw new ResourceNotFoundException("설정할 리뷰를 찾을 수 없습니다.");
        }
    }

    //getAllQna 구현 - 전체 QnA 목록 조회, repository 실행
    public List<QnAListDTO> getAllQna() {
        return adminMapper.getAllQna();
    }

    //getQnaDetail 구현 - QnA 상세 조회, repository 실행
    public QnaDTO getQnaDetail(Integer qna_id) {
        if(qna_id==null){
            throw new ResourceNotFoundException("조회할 QnA를 찾을 수 없습니다.");
        }
        return adminMapper.getQnaDetail(qna_id);
    }


    public void updateMemberPoints(int user_id, Integer points) {
        if (points == null || points < 0) {
            throw new WrongRequestException("포인트는 0 이상이어야 합니다.");
        }
        int affected = adminMapper.updateMemberPoints(user_id, points);
        if (affected == 0) {
            throw new ResourceNotFoundException("포인트를 수정할 회원을 찾을 수 없습니다.");
        }
    }

    // 상품 상세조회
    public ProductDetailDTO getProductDetail(int product_id) {
        ProductDetailDTO result = adminMapper.readProduct(product_id);
        if (result == null) {
            throw new ResourceNotFoundException("조회할 상품을 찾을 수 없습니다.");
        }
        return result;
    }

    public void putImage(int product_id, List<String> imageUrl) {
        for(String image : imageUrl){
            //여기에 이미지 삽입 쿼리문 작성
            int result = adminMapper.insertProductImage(product_id, image);
            if(result == 0){
                throw new DatabaseException("이미지 삽입에 실패했습니다.", null);
            }
        }
    }

    public List<String> readImage(int product_id) {
        List<String> result = adminMapper.readImage(product_id);
        if(result == null || result.isEmpty()){
            throw new ResourceNotFoundException("해당 상품의 이미지를 찾을 수 없습니다.");
        }
        return result;
    }

    public List<UserSummaryDTO> getAllusers() {
        if(adminMapper.getAllusers() == null){
            throw new ResourceNotFoundException( "사용자 정보를 찾을 수 없습니다.");
        }

        return adminMapper.getAllusers();
    }

    // 밴 기록 추가
    public void setBan(int user_id, String reason) {

        int result = adminMapper.setBlacklist(user_id, reason);

        if(result == 0){
            throw new ResourceNotFoundException("밴 기록에 실패했습니다. 해당 사용자를 찾을 수 없습니다.");
        }
    }

    // 유저 탈퇴처리
    public void deleteUser(int user_id) {
        int result = adminMapper.deleteUser(user_id);

        if(result == 0){
            throw new ResourceNotFoundException("사용자 삭제에 실패했습니다. 해당 사용자를 찾을 수 없습니다.");
        }
    }

    // 유저의 밴 처리, 밴 기록 처리 트랜잭션
    @Transactional
    public void blockAndExpelUser(int user_id, String reason) {
        setBan(user_id, reason);
        deleteUser(user_id);
    }
}