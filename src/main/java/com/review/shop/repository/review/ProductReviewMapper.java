package com.review.shop.repository.review;

import com.review.shop.dto.review.ProductReviewDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ProductReviewMapper {

    List<ProductReviewDTO> selectReviewsByProduct(
            @Param("productId") int productId, // 상품 ID
            @Param("sort") String sort // 정렬 옵션 (latest, rating, like_count)
    );
}