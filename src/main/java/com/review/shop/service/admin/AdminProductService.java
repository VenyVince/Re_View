package com.review.shop.service.admin;

import com.review.shop.dto.product.ProductDetailDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.admin.AdminMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminProductService {

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
}
