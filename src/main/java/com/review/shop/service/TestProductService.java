package com.review.shop.service;

import com.review.shop.dto.TestProductResponseDTO;
import com.review.shop.dto.TestProductResponseDTO.TestProductDTO;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class TestProductService {

    public TestProductResponseDTO getTestProducts() {
        // 예제용 하드코딩 데이터
        TestProductDTO p1 = new TestProductDTO(1L, "샴푸", "BrandA", 12000);
        TestProductDTO p2 = new TestProductDTO(2L, "린스", "BrandB", 15000);
        TestProductDTO p3 = new TestProductDTO(3L, "바디워시", "BrandC", 9000);

        return new TestProductResponseDTO(Arrays.asList(p1, p2, p3));
    }
}
