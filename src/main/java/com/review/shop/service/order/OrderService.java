package com.review.shop.service.order;

import com.review.shop.dto.orders.OrderCheckoutProductInfoDTO;
import com.review.shop.dto.orders.OrderCheckoutResponse;
import com.review.shop.dto.orders.OrderDTO;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.repository.Orders.OrderMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;

    // 주문서 작성시, 주문할 상품들의 상세 정보를 조회하는 메서드
    public OrderCheckoutResponse getPrdInfoList(List<OrderDTO> orderList) {


        // 원래는 N+1 문제있었는데, 아이디 모으고 쿼리 한번에 가져옴.
        List<Integer> productIds = orderList.stream()
                .map(OrderDTO::getProduct_id)
                .collect(Collectors.toList());

        List<OrderCheckoutProductInfoDTO> products = orderMapper.getProductsByIds(productIds);

        Map<Integer, OrderCheckoutProductInfoDTO> productMap = products.stream()
                .collect(Collectors.toMap(
                        OrderCheckoutProductInfoDTO::getProduct_id,
                        dto -> dto
                ));

        List<OrderCheckoutProductInfoDTO> finalResultList = new ArrayList<>();
        int totalPrice = 0;

        for (OrderDTO order : orderList) {
            int prdId = order.getProduct_id();
            int quantity = order.getBuy_quantity();

            OrderCheckoutProductInfoDTO product = productMap.get(prdId);

            if (product == null) {
                throw new ResourceNotFoundException("상품을 찾을 수 없습니다. ID: " + prdId);
            }

            // 수량 설정된 새로운 DTO 생성
            OrderCheckoutProductInfoDTO resultDTO = new OrderCheckoutProductInfoDTO(
                    product.getProduct_id(),
                    product.getImage_url(),
                    product.getPrd_name(),
                    product.getPrice(),
                    quantity  // 주문 수량 설정
            );

            int price = quantity * product.getPrice();
            totalPrice += price;
            finalResultList.add(resultDTO);
        }

        return new OrderCheckoutResponse(finalResultList, totalPrice);
    }

    public Integer getUserPoint(int userId) {
        return orderMapper.getUserPoint(userId);
    }
}
