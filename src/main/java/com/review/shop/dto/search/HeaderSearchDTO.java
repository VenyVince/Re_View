package com.review.shop.dto.search;

import lombok.Data;

import java.sql.Date;
import java.util.List;

@Data
public class HeaderSearchDTO {
    private List<HeaderSearchReviewDTO> reviews;
    private List<HeaderSearchProductDTO> products;

    @Data
    public static class HeaderSearchProductDTO {
        private String prd_Name;
        private String prd_brand;
        private String category;
        private int price;
        private float rating;
        private String baumann_type;
        private String description;
    }

    @Data
    public static class HeaderSearchReviewDTO {
    //    User_table
        private String nickname;
        private String content;
        private String user_baumann_type;

    //    Review_table
        private float rating;
        private int like_count;
        private int dislike_count;
        private boolean is_selected;
        private Date created_at;

        private String prd_name;
        private String prd_brand;
    }
}
