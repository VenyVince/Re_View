package com.review.shop.repository.product;

import com.review.shop.dto.product.ProductDTO;
import com.review.shop.dto.product.ProductDetailDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductMapper {

    // 페이징 없이 조건에 맞는 모든 상품 목록을 가져오는 메서드
    List<ProductDTO> selectProductList(
            @Param("sort") String sort,
            @Param("category") String category
    );

    List<ProductDTO> selectAllProducts();

    ProductDetailDTO selectProductDetail(Integer product_id);

    List<String> selectProductImages(Integer product_id);
}