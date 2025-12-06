package com.review.shop.dto.recommendations;

import lombok.Data;

import java.util.List;

@Data
public class RecommendationResponseWrapper {
    private String message;
    private List<RecommendationAdminPickDTO> admin_pick;
}
