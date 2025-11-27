package com.review.shop.dto.report;

import lombok.Data;
import java.util.Date;

@Data
public class ReportResponseDTO {
    private int report_id;
    private String status;
    private String reason;
    private String description;
    private Date created_at;
    private Date processed_at;

    // 신고한 사람 (Reporter)
    private int reporter_id;
    private String reporter_nickname;

    // 신고된 리뷰 및 작성 내용
    private int review_id;
    private String review_content;

    private int review_writer_id;      // 작성자 ID
    private String review_writer_nickname; // 작성자 닉네임
}