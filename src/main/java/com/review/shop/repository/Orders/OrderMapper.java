package com.review.shop.repository.Orders;


import com.review.shop.dto.orders.OrderCheckoutProductInfoDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrderMapper {
    List<OrderCheckoutProductInfoDTO> getProductsByIds(@Param("productIds") List<Integer> productIds);

    Integer getUserPoint(@Param("userId") int userId);
}