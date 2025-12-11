package com.review.shop.service.product;

import com.review.shop.dto.product.ProductDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.image.ImageService;
import com.review.shop.repository.product.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

//@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductMapper productMapper;
    private final ImageService imageService;

    // page, size 매개변수 제거
    public List<ProductDTO> getProductList(String sort, String category) {

        // 정렬 옵션 기본값 처리 및 검증
        if (sort == null || sort.isEmpty()) sort = "latest";
        if (!sort.equals("latest") && !sort.equals("rating") && !sort.equals("price")) {
            throw new WrongRequestException("정렬 옵션이 올바르지 않습니다.");
        }

        try {
            // Mapper 호출 (페이징 변수 없이 호출)
            List<ProductDTO> products = productMapper.selectProductList(sort, category);

            // 이미지 Presigned URL 처리
            products.forEach(product -> {
                if (product.getImage_url() != null && !product.getImage_url().isEmpty()) {
                    String presignedUrl = imageService.presignedUrlGet(product.getImage_url());
                    product.setImage_url(presignedUrl);
                }
            });

            return products;

        } catch (DataAccessException e) {
            throw new DatabaseException("상품 목록 조회 중 DB 오류가 발생했습니다.", e);
        }
    }
}