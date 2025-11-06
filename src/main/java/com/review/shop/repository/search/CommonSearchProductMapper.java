package com.review.shop.repository.search;

import com.review.shop.dto.search.CommonSearchProductDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommonSearchProductMapper {
    List<CommonSearchProductDTO> searchProducts(@Param("keyword") String keyword);
}