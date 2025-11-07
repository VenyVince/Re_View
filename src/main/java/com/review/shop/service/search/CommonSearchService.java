package com.review.shop.service.search;

import com.review.shop.dto.search.header.HeaderSearchProductDTO;
import com.review.shop.dto.search.header.HeaderSearchDTO;
import com.review.shop.dto.search.header.HeaderSearchReviewDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFountException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import com.review.shop.repository.search.CommonSearchReviewMapper;
import com.review.shop.repository.search.CommonSearchProductMapper;

import java.util.List;

@Service
public class CommonSearchService {
    @Autowired
    private CommonSearchReviewMapper reviewMapper;

    @Autowired
    private CommonSearchProductMapper productMapper;

    public HeaderSearchDTO search(String keyword) {
        try {
            List<HeaderSearchReviewDTO> reviews = reviewMapper.searchReviews(keyword);
            List<HeaderSearchProductDTO> products = productMapper.searchProducts(keyword);

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
