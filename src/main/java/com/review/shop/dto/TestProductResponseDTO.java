package com.review.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
public class TestProductResponseDTO {

    private List<TestProductDTO> products;

    public TestProductResponseDTO(List<TestProductDTO> list) {
        this.products = list;
    }

    @Data
    @AllArgsConstructor
    public static class TestProductDTO {
        private Long id;
        private String name;
        private String brand;
        private double price;
    }
}
