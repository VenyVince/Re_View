package com.review.shop.controller;

import com.review.shop.dto.TestProductResponseDTO;
import com.review.shop.service.TestProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test/products")
public class TestProductController {

    @Autowired
    private TestProductService testProductService;

    @GetMapping
    public TestProductResponseDTO getProducts() {
        return testProductService.getTestProducts();
    }
}
