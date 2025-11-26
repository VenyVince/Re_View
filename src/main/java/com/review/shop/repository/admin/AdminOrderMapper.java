package com.review.shop.repository.admin;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AdminOrderMapper {
    //    주문
    //주문 상태 변경
    int updateOrderStatus(@Param("order_id") int order_id,
                          @Param("orderStatus") String orderStatus);
}
