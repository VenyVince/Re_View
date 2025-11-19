package com.review.shop.service.order;


// 결제 처리 서비스

//트랜잭션
//재고 검사 v
//포인트 검사 v
//사용자의 포인트 차감 v
//사용자의 포인트 히스토리 반영 v
//재고 수량 차감 v
//preview 데이터 기반 DB 반영

import com.review.shop.dto.orders.OrderDTO;
import com.review.shop.dto.product.ProductStockDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.Orders.OrderMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class OrderService {

    //getUserPoint 사용 위한 UserService 주입
    private final OrderPreviewService orderPreviewService;
    private final OrderMapper orderMapper;

    // 포인트 검사 및 차감
    public void checkAndDeductPoints(int userId, int pointsToDeduct, String orderId) {
        // 포인트 검사 로직
        int currentUserPoint = orderPreviewService.getUserPoint(userId);

        if (pointsToDeduct <= 0) {
            throw new WrongRequestException ("차감할 포인트는 0보다 커야 합니다.");
        }

        if(currentUserPoint < pointsToDeduct) {
            throw new WrongRequestException ("포인트가 부족합니다.");
        }

        // 회원의 포인트를 차감
        Integer result = deductUserPoints(userId, pointsToDeduct);
        if (result == null || result <= 0) {
            throw new DatabaseException("포인트 차감에 실패했습니다.", null );
        }
        // 회원의 포인트 기록에 히스토리 추가
        Integer historyResult = addPointHistory(userId, pointsToDeduct, "사용된 포인트 차감", orderId);

        if (historyResult == null || historyResult <= 0) {
            throw new DatabaseException ("포인트 히스토리 기록에 실패했습니다.", null);
        }

        return;
    }

    //재고 수량 점검 및 차감 메소드

    //OrderDTO는 product_id, buy_quantity 필드를 가짐 -> 사용자가 주문하려는 상품ID와 수량을 나타냄
    //ProductStockDTO는 product_id, stock 필드를 가짐 -> 상품ID와 현재 재고 수량을 나타냄
    public void checkAndDeductStock(List<OrderDTO> orderDTOList) {

        //orderDTO에서 productId 추출 (리스트화)
        List<Integer> productIds = orderDTOList.stream()
                .map(OrderDTO::getProduct_id)
                .toList();

        // 쿼리 반복을 피하기 위해 단일 쿼리로 재고 조회
        List<ProductStockDTO> products = orderMapper.getProductStocks(productIds);

        Map<Integer, Integer> stockMap = products.stream()
                .collect(Collectors.toMap(ProductStockDTO::getProduct_id, ProductStockDTO::getStock));

        // 사용자의 구매하려는 수량과 재고 비교하는 로직임
        for (OrderDTO order : orderDTOList) {
            Integer currentStock = stockMap.get(order.getProduct_id());

            if (currentStock == null) {
                throw new WrongRequestException("존재하지 않는 상품입니다. ID: " + order.getProduct_id());
            }

            if (currentStock < order.getBuy_quantity()) {
                throw new WrongRequestException("재고가 부족합니다. 상품ID: " + order.getProduct_id());
            }
        }
        
        //재고 차감부분
        for (OrderDTO order : orderDTOList) {
            orderMapper.deductStock(
                    order.getProduct_id(),
                    order.getBuy_quantity()
            );
        }
        return;
    }




    //포인트 차감 메소드
    public Integer deductUserPoints(int userId, int pointsToDeduct) {
        return orderMapper.deductPoints(userId, pointsToDeduct);
    }

    // 차감할때 사용할 포인트 히스토리 기록 반영 메소드
    public Integer addPointHistory(int userId, int pointsChanged, String reason, String orderNo) {
        return orderMapper.addPointHistory(userId, pointsChanged, reason);
    }


    //현재 시간 + 랜덤 문자열 조합한 주문 번호 생성 메소드
    public String createOrderNum() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        String randomPart = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // 결과: 20251119143000-A1B2C3D4
        return datePart + "-" + randomPart;
    }


}
