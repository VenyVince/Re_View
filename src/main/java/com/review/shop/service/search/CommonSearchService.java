package com.review.shop.service.search;

import com.review.shop.dto.search.CommonSearchProductDTO;
import com.review.shop.dto.search.CommonSearchResponse;
import com.review.shop.dto.search.CommonSearchReviewDTO;
import org.springframework.beans.factory.annotation.Autowired;
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

    public CommonSearchResponse search(String keyword) {
        List<CommonSearchReviewDTO> reviews = reviewMapper.searchReviews(keyword);
        List<CommonSearchProductDTO> products = productMapper.searchProducts(keyword);

        CommonSearchResponse response = new CommonSearchResponse();
        response.setReviews(reviews);
        response.setProducts(products);

        return response;
    }
}
