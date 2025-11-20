package com.review.shop.repository.Orders;

import com.review.shop.dto.orders.OrderCheckoutProductInfoDTO;
import com.review.shop.dto.product.ProductStockDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
    public interface OrderMapper {

        // 1. 포인트 차감
        int deductPoints(
                @Param("userId") int userId,
                @Param("pointsToDeduct") int pointsToDeduct
        );

        // 2. 상품 정보 조회
        List<OrderCheckoutProductInfoDTO> getProductsByIds(@Param("productIds") List<Integer> productIds);

        // 3. 유저 현재 포인트 조회
        Integer getUserPoint(@Param("userId") int userId);

        // 4. 포인트 이력 기록
        int addPointHistory(
                @Param("userId") int userId,
                @Param("pointsChanged") int pointsChanged,
                @Param("description") String description
        );

        // 5. 재고 확인용 조회
        List<ProductStockDTO> getProductStocks(@Param("productIds") List<Integer> productIds);

        // 6. 재고 차감
        int deductStock(
                @Param("productId") int productId,
                @Param("quantity") int quantity
        );


    }

