package com.review.shop.service.admin;


import com.review.shop.dto.ProductDetailDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.repository.admin.AdminMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AdminService {

    private final AdminMapper adminMapper;

    // 상품 등록
    public void insertProduct(ProductDetailDTO product) {
        int affected = adminMapper.insertProduct(product);
        if (affected == 0) {
            throw new DatabaseException("상품 등록에 실패했습니다", null);
        }
    }

    // 상품 수정
    public void updateProduct(int productId, ProductDetailDTO product) {
        int affected = adminMapper.updateProduct(productId, product);
        if (affected == 0) {
            throw new DatabaseException("상품 수정에 실패했습니다.", null);
        }
    }

    // 상품 삭제
    public void deleteProduct(int productId) {
        int affected = adminMapper.deleteProduct(productId);
        if (affected == 0) {
            throw new DatabaseException("상품 삭제에 실패했습니다.", null);
        }
    }

    // 주문 상태 변경
    public void updateOrderStatus(int orderId, String orderStatus) {
        int affected = adminMapper.updateOrderStatus(orderId, orderStatus);
        if (affected == 0) {
            throw new DatabaseException("주문 상태 변경에 실패했습니다.", null);
        }
    }


    // QnA 답변 등록/수정
    public void updateQnaAnswer(int qnaId, String adminAnswer) {
        int affected = adminMapper.updateQnaAnswer(qnaId, adminAnswer);
        if (affected == 0) {
            throw new DatabaseException("QnA 답변 등록/수정에 실패했습니다. ", null);
        }
    }

    // 포인트 조회
    public Integer getMemberPoints(int memberId) {
        Integer points = adminMapper.getMemberPoints(memberId);
        if (points == null) {
            throw new DatabaseException("존재하지 않는 회원입니다", null);
        }
        return points;
    }

    //getAllProducts
    public List<ProductDetailDTO> getAllProducts() {
        return adminMapper.getAllProducts();
    }

}