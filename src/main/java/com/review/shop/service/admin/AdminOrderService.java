package com.review.shop.service.admin;

import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.admin.AdminOrderMapper;
import jakarta.annotation.security.RolesAllowed;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@RolesAllowed("ADMIN")
public class AdminOrderService {

    private final AdminOrderMapper adminOrderMapper;
    // 주문 상태 변경
    public void updateOrderStatus(int order_id, String orderStatus) {
        if(orderStatus ==null||orderStatus.isEmpty()){
            throw new WrongRequestException("변경할 주문 상태가 null이거나 존재하지 않습니다");

        }
        int affected = adminOrderMapper.updateOrderStatus(order_id, orderStatus);
        if (affected == 0) {
            throw new ResourceNotFoundException("주문을 찾을 수 없습니다.");
        }
    }
}
