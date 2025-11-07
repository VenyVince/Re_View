package com.review.shop.dto.search;

import com.review.shop.dto.search.header.HeaderSearchProductDTO;
import com.review.shop.dto.search.header.HeaderSearchReviewDTO;
import lombok.Data;

import java.util.List;

@Data
public class CommonSearchResponse {
    private List<HeaderSearchReviewDTO> reviews;
    private List<HeaderSearchProductDTO> products;
}
