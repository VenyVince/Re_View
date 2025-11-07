package com.review.shop.dto.search.later;

import com.review.shop.dto.search.CommonSearchReviewDTO;

import java.util.List;

public class MyPage_SearchResponse {
    private List<CommonSearchReviewDTO> reviews;

    public List<CommonSearchReviewDTO> getProducts() {
        return reviews;
    }
    public void setProducts(List<CommonSearchReviewDTO> reviews) {
        this.reviews = reviews;
    }
}
