package com.review.shop.repository.search.header;

import com.review.shop.dto.search.HeaderSearchProductDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface HeaderSearchProductMapper {
    List<HeaderSearchProductDTO> searchProducts(@Param("keyword") String keyword,
                                                @Param("sort") String sort,
                                                @Param("filter_category") String filter_category,
                                                @Param("filter_brand") String filter_brand);
}