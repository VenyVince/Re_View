package com.review.shop.repository.admin;

import com.review.shop.dto.user.UserSummaryDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminUserMapper {
    //    포인트
    //포인트 조회
    Integer getMemberPoints(int member_id);

    int updateMemberPoints(@Param("user_id") int user_id, @Param("points") Integer points);

    List<UserSummaryDTO> getAllusers();

    int setBlacklist(@Param("user_id") int user_id, @Param("reason") String reason);

    int deleteUser(@Param("user_id") int user_id);
}
