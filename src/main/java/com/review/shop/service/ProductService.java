package com.review.shop.service;


import com.review.shop.repository.ProductMapper;
import com.review.shop.dto.ProductDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductMapper productMapper;

    public List<ProductDTO> getProductList(int page, int size, String sort) {
        // 유효성 검사
        if (page < 1) page = 1;
        if (size < 1 || size > 100) size = 8; // 최대 100개

        // sort 기본값 설정
        if (sort == null || sort.isEmpty()) {
            sort = "latest";
        }

        // 정렬 옵션 검증
        if (!sort.equals("latest") && !sort.equals("rating") && !sort.equals("price")) {
            sort = "latest";
        }

        // offset 계산 (0부터 시작)
        int offset = (page - 1) * size;

        // DB에서 조회
        return productMapper.selectProductList(offset, size, sort);
    }
}
