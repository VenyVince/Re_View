package com.review.shop.repository.userinfo.user_related;

import com.review.shop.dto.userinfo.user_related.Point.PointHistoryDTO;
import com.review.shop.dto.userinfo.user_related.Point.PointResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PointMapper {

    // 포인트 적립/사용 내역 추가
    void aboutPoint(PointHistoryDTO pointHistoryDTO);

    // 사용자 포인트 내역 조회
    List<PointResponseDTO> getPointHistoryByUserId(@Param("user_id") int user_id);

    // 사용자 총 포인트 조회
    Integer getTotalPoint(@Param("user_id") int user_id);

    // 특정 리뷰에 대해 이미 지급된 포인트 확인
    @Select("SELECT COUNT(*) FROM POINT_HISTORY WHERE USER_ID = #{user_id} AND REVIEW_ID = #{review_id}")
    Integer countByUserAndReview(@Param("user_id") int user_id, @Param("review_id") int review_id);
}
