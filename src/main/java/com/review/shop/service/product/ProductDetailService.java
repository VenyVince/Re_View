package com.review.shop.service.product;

import com.review.shop.dto.product.ProductDetailDTO;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.product.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductDetailService {

    @Autowired
    private ProductMapper productMapper;

    public ProductDetailDTO getProductDetail(Integer productId) {
        // 상품 정보 가져오기
        if (productId == null || productId < 1) {
            throw new WrongRequestException("상품 ID가 올바르지 않습니다.");
        }

        ProductDetailDTO product = productMapper.selectProductDetail(productId);

        if (product == null) {
            throw new ResourceNotFoundException("상품을 찾을 수 없습니다.");
        }

        // 이미지 리스트 가져오기 (DB 한번 더 다녀옴)
        List<String> images = productMapper.selectProductImages(productId);

        // 상품 정보에 이미지 리스트 꽂아주기
        product.setProduct_images(images);

        return product;
    }
}