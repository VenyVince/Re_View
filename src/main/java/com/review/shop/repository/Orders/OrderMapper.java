package com.review.shop.repository.Orders;

import com.review.shop.dto.orders.OrderAdminDTO;
import com.review.shop.dto.orders.OrderCheckoutProductInfoDTO;
import com.review.shop.dto.orders.OrderItemDTO;
import com.review.shop.dto.orders.OrderSaveDTO;
import com.review.shop.dto.product.ProductStockDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
    public interface OrderMapper {

        // 1. 포인트 차감
        int deductPoints(
                @Param("user_id") int user_id,
                @Param("pointsToDeduct") int pointsToDeduct
        );

        // 2. 상품 정보 조회
        List<OrderCheckoutProductInfoDTO> getProductsByIds(@Param("product_ids") List<Integer> product_ids);

        // 3. 유저 현재 포인트 조회
        Integer getUserPoint(@Param("user_id") int user_id);

        // 4. 포인트 이력 기록
        int addPointHistory(
                @Param("user_id") int user_id,
                @Param("pointsChanged") int pointsChanged,
                @Param("description") String description
        );

        // 5. 재고 확인용 조회
        List<ProductStockDTO> getProductStocks(@Param("product_ids") List<Integer> product_ids);

        // 6. 재고 차감
        int deductStock(
                @Param("product_id") int product_id,
                @Param("quantity") int quantity
        );

        // Order Table 삽입
        void insertOrders(OrderSaveDTO orderSaveDTO);

        // OrderItems 삽입
        void insertOrderItems(List<OrderItemDTO> orderItems);


    List<OrderAdminDTO> findByOrderNoContainingOrDeliveryNumContaining(String keyword, String keyword1);
}

