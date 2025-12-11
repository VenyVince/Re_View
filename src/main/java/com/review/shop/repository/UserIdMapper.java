package com.review.shop.repository;

import org.apache.ibatis.annotations.Param;

public interface UserIdMapper {
    // 로그인한 id를 기반으로 user_id확인
    Integer getUser_id(@Param("id") String id);
    String getUser_role(@Param("id") String id);
}
