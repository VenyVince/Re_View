package com.review.shop.repository.user;

import com.review.shop.dto.user.UserInfoDto;
import org.apache.ibatis.annotations.Mapper;

//사용자 관련 데이터베이스 작업을 수행하는 매퍼 인터페이스

@Mapper
public interface UserMapper {
    // 사용자 등록 메서드
    int insertUser(UserInfoDto userDTO);
    // 사용자 검색 메서드
<<<<<<< HEAD
    UserInfoDTO findUserById(String id);
<<<<<<< HEAD
=======

    int updatePassword(String id, String newEncodedPassword);
>>>>>>> 6cfed288910a7fccad084736107f1a69663cd697
=======
    UserInfoDto findUserById(String id);
>>>>>>> parent of 814e773e (refactor: 로그인 성공 후 마이페이지 연결 구현)
}