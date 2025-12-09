package com.review.shop.service.search;

import com.review.shop.dto.orders.OrderAdminDTO;
import com.review.shop.dto.search.header.*;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.repository.Orders.OrderMapper;
import com.review.shop.repository.search.header.HeaderSearchProductMapper;
import com.review.shop.repository.search.header.HeaderSearchReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import java.util.Comparator;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HeaderSearchService {
    private final HeaderSearchReviewMapper reviewMapper;

    private final HeaderSearchProductMapper productMapper;
    private final OrderMapper orderMapper;

    public HeaderSearchDTO search(String keyword, String sort, String filter_brand, String filter_category) {
        try {
            List<HeaderSearchReviewDTO> reviews = reviewMapper.searchReviews(keyword, sort,  filter_brand, filter_category);
            List<HeaderSearchProductDTO> products = productMapper.searchProducts(keyword, sort, filter_brand, filter_category);

            if (products.isEmpty() && reviews.isEmpty()) {
                throw new ResourceNotFoundException("검색 결과가 존재하지 않습니다");
            }

            HeaderSearchDTO response = new HeaderSearchDTO();
            response.setReviews(reviews);
            response.setProducts(products);

            return response;
        } catch (DataAccessException e) {
            throw new DatabaseException("DB오류가 발생했습니다. 관리자에게 문의해주세요.", e); //DB오류
        }
    }

    public ListHeaderSearchReviewDTO searchReviews(String keyword, String sort, String filter_brand, String filter_category) {
        try {
            List<HeaderSearchReviewDTO> reviews = reviewMapper.searchReviews(keyword, sort,  filter_brand, filter_category);

            if (reviews.isEmpty()) {
                throw new ResourceNotFoundException("검색 결과가 존재하지 않습니다");
            }
            //ListHeaderSearchReviewDTO에 이미지 리턴 추가
            ListHeaderSearchReviewDTO response = new ListHeaderSearchReviewDTO();
            response.setReviews(reviews);

            return response;
        } catch (DataAccessException e) {
            throw new DatabaseException("DB오류가 발생했습니다. 관리자에게 문의해주세요.", e); //DB오류
        }
    }

    public ListHeaderSearchProductDTO searchProducts(String keyword, String sort, String filter_brand, String filter_category) {
        try {
            List<HeaderSearchProductDTO> reviews = productMapper.searchProducts(keyword, sort,  filter_brand, filter_category);

            if (reviews.isEmpty()) {
                throw new ResourceNotFoundException("검색 결과가 존재하지 않습니다");
            }
            //ListHeaderSearchProductDTO에 대표 이미지 리턴 추가
            ListHeaderSearchProductDTO response = new ListHeaderSearchProductDTO();
            response.setProducts(reviews);

            return response;
        } catch (DataAccessException e) {
            throw new DatabaseException("DB오류가 발생했습니다. 관리자에게 문의해주세요.", e); //DB오류
        }
    }

    public List<OrderAdminDTO> searchOrders(String keyword, String status, String sort) {
        List<OrderAdminDTO> orders = orderMapper
                .findByOrderNoContainingOrDeliveryNumContaining(keyword);

        if (!"all".equals(status)) {
            String statusKorean = switch(status) {
                case "completed" -> "주문완료";
                case "in_delivery" -> "배송중";
                case "delivered" -> "배송완료";
                default -> null;
            };

            if (statusKorean != null) {
                orders = orders.stream()
                        .filter(order -> order.getOrder_status().equals(statusKorean))
                        .collect(Collectors.toList());
            }
        }

        if ("latest".equals(sort)) {
            orders.sort(Comparator.comparing(OrderAdminDTO::getOrder_id).reversed());
        } else if ("oldest".equals(sort)) {
            orders.sort(Comparator.comparing(OrderAdminDTO::getOrder_id));
        }

        if (orders.isEmpty()) {
            throw new ResourceNotFoundException("검색 결과가 없습니다.");
        }

        return orders;
    }
}
