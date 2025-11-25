package com.review.shop.repository;

import org.apache.ibatis.annotations.Param;

public interface OrderItemIdMapper {
    Integer existsOrderItem(@Param("order_item_id")int order_item_id,
                            @Param("user_id")int user_id);
    Integer checkReviewByOrderItemId(@Param("order_item_id")int order_item_id);
}
