package com.review.shop.service.search;

import com.review.shop.dto.search.HeaderSearchDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFountException;
import com.review.shop.repository.search.header.HeaderSearchProductMapper;
import com.review.shop.repository.search.header.HeaderSearchReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HeaderSearchService {
    private final HeaderSearchReviewMapper reviewMapper;

    private final HeaderSearchProductMapper productMapper;

    public HeaderSearchDTO search(String keyword, String sort, float filter_rating) {
        try {
            List<HeaderSearchDTO.HeaderSearchReviewDTO> reviews = reviewMapper.searchReviews(keyword, sort,  filter_rating);
            List<HeaderSearchDTO.HeaderSearchProductDTO> products = productMapper.searchProducts(keyword, sort, filter_rating);

            if (products.isEmpty() && reviews.isEmpty()) {
                throw new ResourceNotFountException("검색 결과가 존재하지 않습니다");
            }

            HeaderSearchDTO response = new HeaderSearchDTO();
            response.setReviews(reviews);
            response.setProducts(products);

            return response;
        } catch (DataAccessException e) {
            throw new DatabaseException("오류가 발생했습니다. 관리자에게 문의해주세요.", e); //DB오류
        }
    }
}
