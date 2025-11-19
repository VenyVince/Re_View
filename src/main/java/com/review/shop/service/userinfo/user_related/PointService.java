package com.review.shop.service.userinfo.user_related;

import com.review.shop.dto.userinfo.user_related.Point.PointHistoryDTO;
import com.review.shop.dto.userinfo.user_related.Point.PointResponseDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.userinfo.user_related.PointMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PointService {

    private final PointMapper pointMapper;

    // 사용자 포인트 총계
    public int getTotalPoint(int user_id) {
        try {
            Integer totalPoint = pointMapper.getTotalPoint(user_id);
            return totalPoint != null ? totalPoint : 0;
        } catch (Exception e) {
            throw new DatabaseException("사용자 총 포인트 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 사용자별 포인트 내역 조회
    public List<PointResponseDTO> getPointHistory(int user_id) {
        try {
            List<PointResponseDTO> history = pointMapper.getPointHistoryByUserId(user_id);
            if (history == null || history.isEmpty()) {
                throw new WrongRequestException("해당 사용자의 포인트 내역이 존재하지 않습니다.");
            }
            return history;
        } catch (Exception e) {
            throw new DatabaseException("사용자 포인트 내역 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 2. 리뷰 작성 보상 적립
    public void addReviewPoint(int user_id, int review_id, int amount) {
        try {
            if (pointMapper.existsReviewPoint(review_id)) return;

            PointHistoryDTO dto = new PointHistoryDTO();
            dto.setUser_id(user_id);
            dto.setAmount(amount);
            dto.setType("EARN");
            dto.setDescription("리뷰 작성 보상");

            pointMapper.aboutPoint(dto);
            pointMapper.insertReviewPointReference(review_id, dto.getUser_id());
        } catch (WrongRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new DatabaseException("리뷰 작성 포인트 적립 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 3. 베스트 리뷰 선정 보상 적립
    public void addBestReviewPoint(int user_id, int review_id, int amount, boolean is_selected) {
        if (!is_selected) return;

        try {
            if (pointMapper.existsBestReviewPoint(review_id)) return;

            PointHistoryDTO dto = new PointHistoryDTO();
            dto.setUser_id(user_id);
            dto.setAmount(amount);
            dto.setType("EARN");
            dto.setDescription("베스트 리뷰 선정 보상");

            pointMapper.aboutPoint(dto);
            pointMapper.insertBestReviewPointReference(review_id, dto.getUser_id());
        } catch (WrongRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new DatabaseException("베스트 리뷰 포인트 적립 중 DB 오류가 발생했습니다.", e);
        }
    }



}
