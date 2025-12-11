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
        if(orderStatus == null || orderStatus.isEmpty()){
            throw new WrongRequestException("변경할 주문 상태가 null이거나 존재하지 않습니다");
        }

        // 영어를 한글로 변환
        String convertedStatus = convertStatusToKorean(orderStatus);

        int affected = adminOrderMapper.updateOrderStatus(order_id, convertedStatus);
        if (affected == 0) {
            throw new ResourceNotFoundException("주문을 찾을 수 없습니다.");
        }
    }

    // 영어 상태를 한글로 변환하는 메서드
    private String convertStatusToKorean(String englishStatus) {
        switch(englishStatus) {
            case "completed":
                return "주문완료";
            case "in_delivery":
                return "배송중";
            case "delivered":
                return "배송완료";
            default:
                throw new WrongRequestException("유효하지 않은 주문 상태입니다: " + englishStatus);
        }
    }
}