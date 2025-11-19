package com.review.shop.service.product;


import com.review.shop.dto.product.ProductDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.WrongRequestException;
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

    public List<ProductDTO> getProductList(int page, int size, String sort) {
        // 유효성 검사
        if (page < 1) throw new WrongRequestException("페이지 값이 올바르지 않습니다.");
        if (size < 1 || size > 100) throw new WrongRequestException("페이지 사이즈가 올바르지 않습니다."); // 최대 100개

        // sort 기본값 설정
        if (sort == null || sort.isEmpty()) sort = "latest";


        // 정렬 옵션 검증
        if (!sort.equals("latest") && !sort.equals("rating") && !sort.equals("price")) {
            throw new WrongRequestException("정렬 옵션이 올바르지 않습니다.");
        }

        // offset 계산 (0부터 시작)
        int offset = (page - 1) * size;
        try {
            // DB에서 조회
            return productMapper.selectProductList(offset, size, sort);
        } catch (DataAccessException e) {
            throw new DatabaseException("상품 목록 조회 중 DB 오류가 발생했습니다.", e);
        }
    }
}
