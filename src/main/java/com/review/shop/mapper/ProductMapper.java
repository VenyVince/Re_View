package com.review.shop.mapper;

import com.review.shop.model.ProductDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ProductMapper {

    /**
     * 상품 목록 조회 (페이징 + 정렬)
     * @param offset 시작 위치
     * @param pageSize 페이지 당 개수
     * @param sort 정렬 옵션 (latest, rating, price)
     * @return 상품 목록
     */
    List<ProductDTO> selectProductList(
            @Param("offset") int offset,
            @Param("pageSize") int pageSize,
            @Param("sort") String sort
    );

    /**
     * 상품 전체 개수 조회 (소프트 삭제 제외)
     * @return 전체 상품 개수
     */
    int selectProductCount();
}
