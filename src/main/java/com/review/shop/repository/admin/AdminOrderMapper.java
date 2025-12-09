package com.review.shop.repository.admin;

import com.review.shop.dto.orders.OrderAdminDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminOrderMapper {
    //    주문
    //주문 상태 변경
    int updateOrderStatus(@Param("order_id") int order_id,
                          @Param("orderStatus") String orderStatus);

    List<OrderAdminDTO> getAllOrders();
}
