package com.review.shop.service.admin;

import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.admin.AdminReviewMapper;
import com.review.shop.service.userinfo.other.PointService;
import jakarta.annotation.security.RolesAllowed;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@RolesAllowed("ADMIN")
public class AdminReviewService {

    private final AdminReviewMapper adminReviewMapper;
    private final PointService pointService;


    // 리뷰 삭제, soft delete(실제 삭제 안하고 deleted_at만 주입하여 필터링)
    public void deleteReview(int review_id) {
        int affected = adminReviewMapper.deleteReview(review_id);
        if (affected == 0) {
            throw new ResourceNotFoundException("삭제할 리뷰를 찾을 수 없습니다.");
        }
        //리뷰 작성자의 user_id 반환
        int user_id = adminReviewMapper.findReviewer(review_id);
        pointService.removeReviewPoint(user_id, review_id);
    }

    //  setReviewSelection 구현 - 운영자 픽 설정 (테스트 완료)
    @Transactional
    public void setReviewSelection(int review_id, Integer is_selected) {
        if (is_selected == null || (is_selected != 0 && is_selected != 1)) {
            throw new WrongRequestException("is_selected 값은 0 또는 1이어야 합니다.");
        }
        int affected = adminReviewMapper.setReviewSelection(review_id, is_selected);
        if (affected == 0) {
            throw new ResourceNotFoundException("설정할 리뷰를 찾을 수 없습니다.");
        }
        //리뷰 작성자의 user_id 반환
        int user_id = adminReviewMapper.findReviewer(review_id);
        pointService.addSelectedReviewPoint(user_id, review_id);
    }
}
