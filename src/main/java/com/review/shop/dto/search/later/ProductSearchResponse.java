package com.review.shop.dto.search.later;

import com.review.shop.dto.search.CommonSearchProductDTO;

import java.util.List;

public class ProductSearchResponse {
    private List<CommonSearchProductDTO> products;


    public List<CommonSearchProductDTO> getProducts() {
        return products;
    }
    public void setProducts(List<CommonSearchProductDTO> products) {
        this.products = products;
    }

}
