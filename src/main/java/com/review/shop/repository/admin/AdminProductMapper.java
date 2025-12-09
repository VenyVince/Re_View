package com.review.shop.repository.admin;

import com.review.shop.dto.product.ProductDetailWithThumbnailDTO;
import com.review.shop.dto.product.ProductUpdateOnlyPrdInfoDTO;
import com.review.shop.dto.product.ProductUploadDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminProductMapper {
    //    상품
    //상품 등록
    int insertProduct(ProductUpdateOnlyPrdInfoDTO product);

    //상품 수정
    int updateProduct(@Param("product_id") int product_id,
                      @Param("product") ProductUploadDTO product);

    //상품 삭제
    int deleteProduct(int product_id);

    List<ProductDetailWithThumbnailDTO> getAllProducts();

    String readImage(int product_id);

    // 상품 상세조회
    ProductUploadDTO getProductInfo(int productId);
}
