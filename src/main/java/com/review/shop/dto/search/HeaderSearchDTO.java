package com.review.shop.dto.search;

import lombok.Data;

import java.sql.Date;
import java.util.List;

@Data
public class HeaderSearchDTO {
    private List<HeaderSearchReviewDTO> reviews;
    private List<HeaderSearchProductDTO> products;




}
