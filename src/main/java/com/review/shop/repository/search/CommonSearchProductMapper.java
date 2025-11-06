package com.review.shop.repository.search;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommonSearchProductMapper {
    List<ProductDTO> searchProducts(@Param("keyword") String keyword);
}