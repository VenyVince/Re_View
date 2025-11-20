package com.review.shop.repository.user;

import com.review.shop.dto.user.UserInfoDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

//사용자 관련 데이터베이스 작업을 수행하는 매퍼 인터페이스

@Mapper
public interface UserMapper {
    // 사용자 등록 메서드
    int insertUser(UserInfoDTO userDTO);
    // 사용자 검색 메서드
    UserInfoDTO findUserById(String id);

    int updatePassword(String id, String newEncodedPassword);

    String findUserIdByNameAndPhoneNumber(@Param("name") String name,
                                          @Param("phoneNumber") String phoneNumber);

    int findBannedByUserId(@Param("id") int id);

    String findEmailById(@Param("id") String id);
}