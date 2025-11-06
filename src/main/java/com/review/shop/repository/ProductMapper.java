package com.review.shop.repository;

import com.review.shop.dto.ProductDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ProductMapper {

    List<ProductDTO> selectProductList(
            @Param("offset") int offset, //offset 시작 위치
            @Param("pageSize") int pageSize, //pageSize 페이지 당 개수
            @Param("sort") String sort //sort 정렬 옵션 (latest, rating, price)
    );

}
