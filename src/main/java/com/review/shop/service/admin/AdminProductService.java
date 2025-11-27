package com.review.shop.service.admin;

import com.review.shop.dto.product.ProductDetailDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.admin.AdminProductMapper;
import jakarta.annotation.security.RolesAllowed;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Collections;

@Service
@AllArgsConstructor
@RolesAllowed("ADMIN")
public class AdminProductService {

    private final AdminProductMapper adminProductMapper;

    //getAllProducts
    public List<ProductDetailDTO> getAllProducts() {
        return adminProductMapper.getAllProducts();
    }

    // 상품 등록
    public void insertProduct(ProductDetailDTO product) {
        if (product == null) {
            throw new WrongRequestException("상품 정보가 전달되지 않았습니다.");
        }
        int affected = adminProductMapper.insertProduct(product);
        if (affected == 0) {
            throw new DatabaseException("상품 등록에 실패했습니다.", null);
        }
    }

    // 상품 수정
    public void updateProduct(int product_id, ProductDetailDTO product) {
        if (product == null) {
            throw new WrongRequestException("수정할 상품 정보가 전달되지 않았습니다.");
        }
        int affected = adminProductMapper.updateProduct(product_id, product);
        if (affected == 0) {
            throw new ResourceNotFoundException("수정할 상품을 찾을 수 없습니다.");
        }
    }

    // 상품 삭제
    public void deleteProduct(int product_id) {
        int affected = adminProductMapper.deleteProduct(product_id);
        if (affected == 0) {
            throw new ResourceNotFoundException("삭제할 상품을 찾을 수 없습니다.");
        }
    }

    // 상품 상세조회
    public ProductDetailDTO getProductDetail(int product_id) {
        ProductDetailDTO result = adminProductMapper.readProduct(product_id);
        if (result == null) {
            throw new ResourceNotFoundException("조회할 상품을 찾을 수 없습니다.");
        }
        return result;
    }


    //Product_image 테이블에 삽입하기
    public void putImage(int product_id, List<String> imageUrl) {
        for(String image : imageUrl){
            //여기에 이미지 삽입 쿼리문 작성
            int result = adminProductMapper.insertProductImage(product_id, image);
            if(result == 0){
                throw new DatabaseException("이미지 삽입에 실패했습니다.", null);
            }
        }
    }

    //상품 등록과 이미지 등록 트랜잭션처리
    @Transactional
    public void uploadProductAndImages(ProductDetailDTO product) {

        //상품 테이블에 데이터 먼저 삽입
        insertProduct(product);
        int prd_id = product.getProduct_id();
        List<String> product_images = product.getProduct_images();

        //상품 이미지 테이블에 데이터 삽입
        putImage(prd_id, product_images);
    }

    //이미지 불러오기
    public List<String> readImage(int product_id) {
        List<String> result = adminProductMapper.readImage(product_id);

        return (result == null || result.isEmpty()) ? Collections.emptyList() : result;
    }

    //이미지 삭제하기
    public void deleteProductImages(int productId) {
        int affected = adminProductMapper.deleteProductImages(productId);
        if (affected == 0) {
            throw new ResourceNotFoundException("해당 상품의 기존 이미지를 찾을 수 없습니다.");
        }
    }

    //이미지 삭제하고 삽입하기 트랜잭션
    @Transactional
    public void updateProductImages(int product_id, List<String> imageUrls) {
        //기존 이미지 삭제
        deleteProductImages(product_id);
        //새 이미지 삽입
        putImage(product_id, imageUrls);
    }
}
