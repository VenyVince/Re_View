package com.review.shop.service.admin;

import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.admin.AdminReviewMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminReviewService {

    private final AdminReviewMapper adminReviewMapper;

    //리뷰 삭제, 실제로 삭제 안하고 DELETED_DATE 플래그 설정
    public void deleteReview(int review_id) {
        int affected = adminReviewMapper.deleteReview(review_id);
        if (affected == 0) {
            throw new ResourceNotFoundException("삭제할 리뷰를 찾을 수 없습니다.");
        }
    }

    //  setReviewSelection 구현 - 운영자 픽 설정 (테스트 완료)
    public void setReviewSelection(int review_id, Integer isSelected) {
        if (isSelected == null || (isSelected != 0 && isSelected != 1)) {
            throw new WrongRequestException("is_selected 값은 0 또는 1이어야 합니다.");
        }
        int affected = adminReviewMapper.setReviewSelection(review_id, isSelected);
        if (affected == 0) {
            throw new ResourceNotFoundException("설정할 리뷰를 찾을 수 없습니다.");
        }
    }




}
