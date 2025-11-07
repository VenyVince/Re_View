package com.review.shop.service.search;

import com.review.shop.dto.search.CommonSearchProductDTO;
import com.review.shop.dto.search.CommonSearchDTO;
import com.review.shop.dto.search.CommonSearchReviewDTO;
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

    public CommonSearchDTO search(String keyword) {
        try {
            List<CommonSearchReviewDTO> reviews = reviewMapper.searchReviews(keyword);
            List<CommonSearchProductDTO> products = productMapper.searchProducts(keyword);

            if (products.isEmpty() && reviews.isEmpty()) {
                throw new ResourceNotFountException("검색 결과가 존재하지 않습니다");
            }

            CommonSearchDTO response = new CommonSearchDTO();
            response.setReviews(reviews);
            response.setProducts(products);

            return response;
        } catch (DataAccessException e) {
            throw new DatabaseException("오류가 발생했습니다. 관리자에게 문의해주세요.", e); //DB오류
        }
    }
}
