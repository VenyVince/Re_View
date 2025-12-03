package com.review.shop.dto.search.MyPageProductPage.Product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.sql.Date;
import java.util.List;

@Data
public class ProductReview_SearchDTO {
    private int review_id;

    //    User_table
    private String nickname;
    private String user_baumann_type;

    //    Review_table
    private String content;
    private float rating;
    private int like_count;
    private int dislike_count;
    private boolean is_selected;
    private Date created_at;

    @JsonIgnore
    private Date updated_at; // update시 (수정됨)으로 표기하는 용도 json 변환시 제외

    public String getUpdatedStatus() {
        if (updated_at == null) {
            return ""; // 수정되지 않은 리뷰면 표시 X
        } else {
            return "(수정됨)"; // 수정되면 수정되었다고 표시함
        }
    }

    //     Review_image
    private List<String> image_urls;
}