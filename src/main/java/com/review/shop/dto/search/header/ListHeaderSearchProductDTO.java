package com.review.shop.dto.search.header;

import lombok.Data;

import java.util.List;

@Data
public class ListHeaderSearchProductDTO {
    private List<HeaderSearchProductDTO> products;
}
