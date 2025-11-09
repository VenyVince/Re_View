package com.review.shop.repository.search.header;

import com.review.shop.dto.search.HeaderSearchDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface HeaderSearchProductMapper {
    List<HeaderSearchDTO.HeaderSearchProductDTO> searchProducts(@Param("keyword") String keyword, @Param("sort") String sort, @Param("filter_rating") float filter_rating);
}