package com.review.shop.service.order;


// 결제 처리 서비스

import com.review.shop.dto.orders.*;
import com.review.shop.dto.product.ProductStockDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.Orders.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class OrderService {

    //getUserPoint 사용 위한 UserService 주입
    private final OrderPreviewService orderPreviewService;
    private final OrderMapper orderMapper;

    // 포인트 검사 및 차감
    public void checkAndDeductPoints(OrderCreateDTO orderCreateDTO) {

        int user_id = orderCreateDTO.getUser_id();
        int pointsToDeduct = orderCreateDTO.getUsing_point();

        if (pointsToDeduct == 0) {
            return;
        }
        if (pointsToDeduct < 0) {
            throw new WrongRequestException ("차감할 포인트는 음수일 수 없습니다.");
        }

        // 기존에는 get으로 포인트를 검사하였으나, 동시성 문제로 인해 차감 시도 후 결과로 검사하는 방식으로 변경
        Integer result = deductUserPoints(user_id, pointsToDeduct);
        if (result == 0) {
            throw new WrongRequestException("포인트가 부족합니다.");
        }

        // 회원의 포인트 기록에 히스토리 추가
        Integer historyResult = addPointHistory(user_id, pointsToDeduct, "사용된 포인트 차감");

        if (historyResult == null || historyResult <= 0) {
            throw new DatabaseException ("포인트 히스토리 기록에 실패했습니다.", null);
        }
    }

    //재고 수량 점검 및 차감 메소드

    //OrderDTO는 product_id, buy_quantity 필드를 가짐 -> 사용자가 주문하려는 상품ID와 수량을 나타냄
    //ProductStockDTO는 product_id, stock 필드를 가짐 -> 상품ID와 현재 재고 수량을 나타냄
    public void checkAndDeductStock(OrderCreateDTO orderCreateDTO) {


        List<OrderDTO> orderDTOList = orderCreateDTO.getOrder_list();
        //orderDTO에서 productId 추출 (리스트화)
        List<Integer> product_ids = orderDTOList.stream()
                .map(OrderDTO::getProduct_id)
                .toList();

        // 쿼리 반복을 피하기 위해 단일 쿼리로 재고 조회
        List<ProductStockDTO> products = orderMapper.getProductStocks(product_ids);

        Map<Integer, Integer> stockMap = products.stream()
                .collect(Collectors.toMap(ProductStockDTO::getProduct_id, ProductStockDTO::getStock));

        //재고 차감부분
        for (OrderDTO order : orderDTOList) {
            int affectedRows = orderMapper.deductStock(
                    order.getProduct_id(),
                    order.getBuy_quantity()
            );
            // 기존에는 get으로 재고를 검사하였으나, 동시성 문제로 인해 차감 시도 후 결과로 검사하는 방식으로 변경
            if (affectedRows == 0) {
                throw new WrongRequestException("재고가 부족합니다. 상품ID: " + order.getProduct_id());
            }
        }
    }


    // Order 테이블과 OrderItem 테이블에 주문 정보 반영 메소드
    public void saveOrderToDatabase(OrderCreateDTO orderCreateDTO) {
        String orderNum = createOrderNum();

        //주문 상품 정보 조회
        List<OrderDTO> orderDTOList = orderCreateDTO.getOrder_list();

        // 요청된 상품 ID 목록 추출
        List<Integer> product_ids = orderDTOList.stream()
                .map(OrderDTO::getProduct_id)
                .toList();
        List<OrderCheckoutProductInfoDTO> dbProductInfoList = orderMapper.getProductsByIds(product_ids);

        // 키밸류 맵으로 변경함
        Map<Integer, OrderCheckoutProductInfoDTO> productMap = dbProductInfoList.stream()
                .collect(Collectors.toMap(
                        OrderCheckoutProductInfoDTO::getProduct_id,
                        Function.identity()
                ));

        int calculatedTotalPrice = 0; // 서버에서 계산한 실제 총 상품 금액
        List<OrderItemDTO> orderItemsToInsert = new ArrayList<>();

        for (OrderDTO requestItem : orderDTOList) {
            // Map에서 상품 정보 꺼내기
            OrderCheckoutProductInfoDTO productInfo = productMap.get(requestItem.getProduct_id());

            if (productInfo == null) {
                throw new WrongRequestException("상품 정보를 찾을 수 없습니다. ID: " + requestItem.getProduct_id());
            }

            int quantity = requestItem.getBuy_quantity();
            int realPrice = productInfo.getPrice();

            // 총액 누적 계산
            calculatedTotalPrice += realPrice * quantity;

            // ORDER_ITEM 테이블용 DTO 생성
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setProduct_id(productInfo.getProduct_id());
            itemDTO.setPrd_name(productInfo.getPrd_name());
            itemDTO.setProduct_price(realPrice);
            itemDTO.setQuantity(quantity);

            orderItemsToInsert.add(itemDTO);
        }

        //ORDERS 테이블 저장용 객체 생성
        OrderSaveDTO orderSaveDTO = new OrderSaveDTO();
        orderSaveDTO.setUser_id(orderCreateDTO.getUser_id());
        orderSaveDTO.setAddress_id(orderCreateDTO.getAddress_id());
        orderSaveDTO.setPayment_id(orderCreateDTO.getPayment_id());
        orderSaveDTO.setTotal_price(calculatedTotalPrice);
        orderSaveDTO.setOrder_no(orderNum);


        // ORDERS 테이블에 주문 정보 저장
        orderMapper.insertOrders(orderSaveDTO);

        //ORDERS 생성하고 생성된 PK값 가져오기
        int generatedOrderId = orderSaveDTO.getOrder_id();

        for(OrderItemDTO item : orderItemsToInsert) {
            item.setOrder_id(generatedOrderId);
        }

        // 주문 상세(OrderItems) 일괄 저장
        orderMapper.insertOrderItems(orderItemsToInsert);
    }


    //트랜잭션용 최종 오더
    @Transactional
    public void processOrder(OrderCreateDTO orderCreateDTO) {
        //포인트 차감 검사 및 반영
        checkAndDeductPoints(orderCreateDTO);
        //재고 차감 검사 및 반영
        checkAndDeductStock(orderCreateDTO);
        //DB에 주문 정보 저장
        saveOrderToDatabase(orderCreateDTO);
    }



    //포인트 차감 메소드
    public Integer deductUserPoints(int user_id, int pointsToDeduct) {
        return orderMapper.deductPoints(user_id, pointsToDeduct);
    }

    // 차감할때 사용할 포인트 히스토리 기록 반영 메소드
    public Integer addPointHistory(int user_id, int pointsChanged, String reason) {
        return orderMapper.addPointHistory(user_id, pointsChanged, reason);
    }


    //현재 시간 + 랜덤 문자열 조합한 주문 번호 생성 메소드
    public String createOrderNum() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        String randomPart = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // 결과: 20251119143000-A1B2C3D4
        return datePart + "-" + randomPart;
    }


}
