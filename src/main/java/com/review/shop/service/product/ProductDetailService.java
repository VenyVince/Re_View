package com.review.shop.service.product;

import com.review.shop.dto.product.ProductDetailDTO;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.image.ImageService;
import com.review.shop.repository.product.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductDetailService {

    private final ProductMapper productMapper;
    private final ImageService imageService;

    public ProductDetailDTO getProductDetail(Integer product_id) {
        // 상품 정보 가져오기
        if (product_id == null || product_id < 1) {
            throw new WrongRequestException("상품 ID가 올바르지 않습니다.");
        }

        ProductDetailDTO product = productMapper.selectProductDetail(product_id);

        if (product == null) {
            throw new ResourceNotFoundException("상품을 찾을 수 없습니다.");
        }

        // 이미지 리스트 가져오기 (DB 한번 더 다녀옴)
        List<String> imageKeys = productMapper.selectProductImages(product_id);

        List<String> imageUrls = new ArrayList<>();

        if (imageKeys != null && !imageKeys.isEmpty()) {
            // 리스트를 돌면서 하나씩 URL로 바꿈
            imageUrls = imageKeys.stream()
                    .map(key -> imageService.presignedUrlGet(key)) // ImageService 호출
                    .collect(Collectors.toList());
        }

        product.setProduct_images(imageUrls);

        return product;
    }
}