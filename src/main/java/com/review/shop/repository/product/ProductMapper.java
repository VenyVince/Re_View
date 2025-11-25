package com.review.shop.repository.product;

import com.review.shop.dto.product.ProductDTO;
import com.review.shop.dto.product.ProductDetailDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductMapper {

    // 페이징 및 정렬된 상품 목록을 가져오는 메서드
    List<ProductDTO> selectProductList(
            @Param("offset") int offset, //offset 시작 위치
            @Param("size") int pageSize, //pageSize 페이지 당 개수
            @Param("sort") String sort, //sort 정렬 옵션 (latest, rating, price)
            @Param("category") String category
    );

    // 상품 정보만 가져오는 메서드 (기존)
    ProductDetailDTO selectProductDetail(Integer product_id);

    // 해당 상품의 이미지 URL 리스트만 가져오는 메서드
    List<String> selectProductImages(Integer product_id);
}

