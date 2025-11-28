package com.review.shop.service.userinfo.other;

import com.review.shop.dto.userinfo.user_related.Point.PointHistoryDTO;
import com.review.shop.dto.userinfo.user_related.Point.PointResponseDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.userinfo.user_related.PointMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PointService {

    private final PointMapper pointMapper;
    private final HttpServletResponse httpServletResponse;

    public static class PointConstants{
        public static final int CreateREVIEW = 100;
        public static final int SelectedREVIEW = 500;
        public static final int BestREVIEW = 700;
    }


    @Transactional
    public void updateUserPoint(PointHistoryDTO dto) {
        // 1. 유저 포인트 조회 및 잠금
        int user_id = dto.getUser_id();

        Integer new_point = pointMapper.selectForUpdate(user_id);
        if(new_point == null){
            new_point = 0;
        }
        if ("EARN".equals(dto.getType())) {
            new_point += dto.getAmount();
        } else if ("USE".equals(dto.getType())) {
            new_point -= dto.getAmount();
        }

        if (new_point < 0) {
            throw new WrongRequestException("포인트가 부족합니다.");
        }

        // 2. 업데이트
        pointMapper.updateUserPoint(user_id, new_point);

        // 3. 응답 객체 생성
        PointHistoryDTO response = new PointHistoryDTO();
        response.setUser_id(user_id);
        response.setType(dto.getType());
        response.setAmount(dto.getAmount()); // 새 필드가 있다면 반영

    }


    // 사용자 총 포인트 조회
    public int getTotalPoint(int user_id) {
        try {
            Integer total_point = pointMapper.getTotalPoint(user_id);
            return total_point != null ? total_point : 0;
        } catch (Exception e) {
            throw new DatabaseException("사용자 총 포인트 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 사용자 포인트 내역 조회
    public List<PointResponseDTO> getPointHistory(int user_id) {
        try {
            List<PointResponseDTO> history = pointMapper.getPointHistoryByUserId(user_id);
            if (history == null || history.isEmpty()) {
                throw new ResourceNotFoundException("해당 사용자의 포인트 내역이 존재하지 않습니다.");
            }
            return history;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new DatabaseException("사용자 포인트 내역 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 포인트 적립 시 반복되는 부분 함수로 묶음
    private void processPoint(int user_id, Integer review_id, int amount, String type, String description) {
        try {
            PointHistoryDTO point_history_dto = new PointHistoryDTO();
            point_history_dto.setUser_id(user_id);
            point_history_dto.setAmount(amount);
            point_history_dto.setType(type);
            point_history_dto.setDescription(description);

            updateUserPoint(point_history_dto);
            pointMapper.aboutPoint(point_history_dto, review_id);

        } catch (Exception e) {
            throw new DatabaseException("포인트 처리 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 리뷰 작성시 포인트 지급 
    @Transactional
    public void addReviewPoint(int user_id, int review_id) {
        processPoint(user_id, review_id, PointConstants.CreateREVIEW, "EARN", "리뷰 작성 보상");
    }

    // 리뷰 삭제시 포인트 회수
    @Transactional
    public void removeReviewPoint(int user_id, int review_id) {
        processPoint(user_id, review_id, PointConstants.CreateREVIEW, "USE", "리뷰 삭제로 인한 포인트 회수");
    }

    // 운영자 채택 리뷰 포인트 지급
    @Transactional
    public void addSelectedReviewPoint(int user_id, int review_id) {
        processPoint(user_id, review_id, PointConstants.SelectedREVIEW, "EARN", "운영자 리뷰 채택 보상");
    }

    // 베스트 리뷰 포인트 지급(중복 지급 방지)
    @Transactional
    public void addBestReviewPoint(int user_id, int review_id) {
        try {
            // 중복 지급 여부
            boolean paid = pointMapper.checkBestReviewPoint(user_id, review_id, PointConstants.BestREVIEW, "EARN");
            if (paid) return;

            processPoint(user_id, review_id, PointConstants.BestREVIEW, "EARN", "Best 리뷰 선정 보상");
        } catch (Exception e) {
            throw new DatabaseException("Best 리뷰 포인트 적립 중 DB 오류가 발생했습니다.", e);
        }
    }

    // 유저의 포인트 사용
    @Transactional
    public void usePoint(int user_id, int use_point) {
        processPoint(user_id, null, use_point, "USE", "물품 구매로 인한 차감");
    }

}
