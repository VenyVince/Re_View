package com.review.shop.dto.search;

import lombok.Data;

import java.util.List;

@Data
public class CommonSearchDTO {
    private List<CommonSearchReviewDTO> reviews;
    private List<CommonSearchProductDTO> products;
}
