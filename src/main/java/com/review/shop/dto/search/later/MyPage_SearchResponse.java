package com.review.shop.dto.search.later;

import com.review.shop.dto.search.header.HeaderSearchReviewDTO;

import java.util.List;

public class MyPage_SearchResponse {
    private List<HeaderSearchReviewDTO> reviews;

    public List<HeaderSearchReviewDTO> getProducts() {
        return reviews;
    }
    public void setProducts(List<HeaderSearchReviewDTO> reviews) {
        this.reviews = reviews;
    }
}
