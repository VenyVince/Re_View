package com.review.shop.repository.userinfo.user_related;

import com.review.shop.dto.userinfo.user_related.Point.PointHistoryDTO;
import com.review.shop.dto.userinfo.user_related.Point.PointResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PointMapper {

    // 포인트 적립/사용 내역 추가
    void aboutPoint(@Param("dto")PointHistoryDTO dto, @Param("review_id")Integer review_id);
    void updateUserPoint(@Param("user_id") int user_id, @Param("newPoint") int newPoint);
    int selectForUpdate(@Param("user_id") int user_id);

    // 사용자 포인트 내역 조회
    List<PointResponseDTO> getPointHistoryByUserId(@Param("user_id") int user_id);

    // 사용자 총 포인트 조회
    Integer getTotalPoint(@Param("user_id") int user_id);

    // 중복 지급 방지용 체크
    boolean checkBestReviewPoint(@Param("user_id") int user_id,
                                 @Param("review_id") int review_id,
                                 @Param("amount") int amount,
                                 @Param("type") String type);
}
