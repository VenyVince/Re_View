package com.review.shop.service.userinfo.user_related;

import com.review.shop.dto.userinfo.user_related.Point.PointHistoryDTO;
import com.review.shop.dto.userinfo.user_related.Point.PointResponseDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.repository.userinfo.user_related.PointMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PointService {

    private final PointMapper pointMapper;

    public static class PointConstants{
        public static final int CreateREVIEW = 100;
        public static final int SelectedREVIEW = 500;
        public static final int BestREVIEW = 1000;
        public static int usePoint = 0; // 다른 곳에서 직접 사용
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


    // 리뷰 작성 포인트 적립
    public void addReviewPoint(int user_id) {
        try {
            PointHistoryDTO dto = new PointHistoryDTO();
            dto.setUser_id(user_id);
            dto.setAmount(PointConstants.CreateREVIEW);
            dto.setType("EARN");
            dto.setDescription("리뷰 작성 보상");

            pointMapper.aboutPoint(dto); // 포인트 히스토리 및 합계 반영
        } catch (Exception e) {
            throw new DatabaseException("리뷰 작성 포인트 적립 중 DB 오류가 발생했습니다.", e);
        }
    }

    public void removeReviewPoint(int user_id) {
        try {
            PointHistoryDTO dto = new PointHistoryDTO();
            dto.setUser_id(user_id);
            dto.setAmount(PointConstants.CreateREVIEW);
            dto.setType("USE");
            dto.setDescription("리뷰 삭제로 인한 포인트 회수");

            System.out.println("TYPE: [" + dto.getType() + "]");
            pointMapper.aboutPoint(dto); // 포인트 히스토리 및 합계 반영
        } catch (Exception e) {
            throw new DatabaseException("리뷰 작성 포인트 적립 중 DB 오류가 발생했습니다.", e);
        }
    }

    public void addSelectedReviewPoint(int user_id) {
        try {
            PointHistoryDTO dto = new PointHistoryDTO();
            dto.setUser_id(user_id);
            dto.setAmount(PointConstants.SelectedREVIEW);
            dto.setType("EARN");
            dto.setDescription("운영자 리뷰 채택 보상");

            pointMapper.aboutPoint(dto); // 포인트 히스토리 및 합계 반영
        } catch (Exception e) {
            throw new DatabaseException("리뷰 작성 포인트 적립 중 DB 오류가 발생했습니다.", e);
        }
    }

    public void addBestReviewPoint(int user_id) {
        try {
            PointHistoryDTO dto = new PointHistoryDTO();
            dto.setUser_id(user_id);
            dto.setAmount(PointConstants.BestREVIEW);
            dto.setType("EARN");
            dto.setDescription("Best 리뷰 선정 보상");

            pointMapper.aboutPoint(dto); // 포인트 히스토리 및 합계 반영
        } catch (Exception e) {
            throw new DatabaseException("리뷰 작성 포인트 적립 중 DB 오류가 발생했습니다.", e);
        }
    }
    // 물품 구매시 Point 사용
    public void usePoint(int user_id) {
        try {
            PointHistoryDTO dto = new PointHistoryDTO();
            dto.setUser_id(user_id);
            dto.setAmount(PointConstants.usePoint);
            dto.setType("EARN");
            dto.setDescription("물품 구매로 인한 차감");

            pointMapper.aboutPoint(dto);
        } catch (Exception e) {
            throw new DatabaseException("리뷰 작성 포인트 적립 중 DB 오류가 발생했습니다.", e);
        }
    }
}
