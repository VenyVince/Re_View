package com.review.shop.repository.admin;

import com.review.shop.dto.product.ProductDetailDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminProductMapper {
    //    상품
    //상품 등록
    int insertProduct(ProductDetailDTO product);

    //상품 수정
    int updateProduct(@Param("product_id") int product_id,
                      @Param("product") ProductDetailDTO product);

    //상품 삭제
    int deleteProduct(int product_id);

    List<ProductDetailDTO> getAllProducts();


    ProductDetailDTO readProduct(int product_id);

    int insertProductImage(@Param("product_id") int product_id, @Param("image") String image, @Param("is_thumbnail") String is_thumbnail);

    List<String> readImage(int product_id);

    int deleteProductImages(@Param("product_id") int product_id);

    int updateAllImagesToNo(int productId);
}
