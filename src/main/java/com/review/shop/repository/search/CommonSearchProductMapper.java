package com.review.shop.repository.search;

import com.review.shop.dto.search.header.HeaderSearchProductDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommonSearchProductMapper {
    List<HeaderSearchProductDTO> searchProducts(@Param("keyword") String keyword);
}