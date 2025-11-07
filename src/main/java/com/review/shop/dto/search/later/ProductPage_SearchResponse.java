package com.review.shop.dto.search.later;

import com.review.shop.dto.search.header.HeaderSearchProductDTO;

import java.util.List;

public class ProductPage_SearchResponse {
    private List<HeaderSearchProductDTO> products;


    public List<HeaderSearchProductDTO> getProducts() {
        return products;
    }
    public void setProducts(List<HeaderSearchProductDTO> products) {
        this.products = products;
    }

}
