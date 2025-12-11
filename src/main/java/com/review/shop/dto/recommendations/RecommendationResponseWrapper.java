package com.review.shop.dto.recommendations;

import lombok.Data;

@Data
public class RecommendationResponseWrapper {
    private String message;
    private RecommendationAdminPickDTO admin_pick;
}
