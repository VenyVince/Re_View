package com.review.shop.dto.review.community;

import lombok.Data;

@Data
public class ReportRequestDTO {
    private String reason;      // 신고 사유 (광고, 욕설 등)
    private String description; // 상세 설명
}