package com.review.shop.controller.review;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.review.MyPageReviewResponseDTO;
import com.review.shop.dto.search.ProductReview_SearchResponseDTO;
import com.review.shop.service.review.MyPageReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/reviews/search")
@RequiredArgsConstructor
public class MyPageReviewController {
    private final Security_Util security_util;
    private final MyPageReviewService mypagereviewService;

    @GetMapping
    public ResponseEntity<MyPageReviewResponseDTO> search(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false, defaultValue = "") String keyword,
            @RequestParam(required = false, defaultValue = "latest") String sort,
            @RequestParam(required = false, defaultValue = "0") float filter_rating
    ){
        int user_id = security_util.getCurrentUserId();
        return ResponseEntity.ok(mypagereviewService.(user_id, keyword, sort, filter_rating));
    }
}
