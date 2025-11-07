package com.review.shop.dto.search.header;

import lombok.Data;

import java.util.List;

@Data
public class HeaderSearchResponse {
    private List<HeaderSearchReviewDTO> reviews;
    private List<HeaderSearchProductDTO> products;
}
