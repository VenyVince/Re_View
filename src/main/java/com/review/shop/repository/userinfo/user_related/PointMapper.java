package com.review.shop.repository.userinfo.user_related;

import com.review.shop.dto.userinfo.user_related.Point.PointHistoryDTO;
import com.review.shop.dto.userinfo.user_related.Point.PointResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PointMapper {

    // 포인트 적립 / 사용 내역 추가
    void aboutPoint(PointHistoryDTO pointHistoryDTO);

    // 사용자별 포인트 내역 전체 조회
    List<PointResponseDTO> getPointHistoryByUserId(@Param("user_id") int user_id);

    // 사용자 총 포인트 조회
    Integer getTotalPoint(@Param("user_id") int user_id);

    // 리뷰 포인트 중복 체크용
    boolean existsReviewPoint(@Param("review_id") int review_id);
    void insertReviewPointReference(@Param("review_id") int review_id, @Param("user_id") int user_id);
    boolean existsBestReviewPoint(@Param("review_id") int review_id);
    void insertBestReviewPointReference(@Param("review_id") int review_id, @Param("user_id") int user_id);
}
