package com.review.shop.repository.userinfo;

import com.review.shop.dto.userinfo.GetUserInfoDTO;
import com.review.shop.dto.userinfo.UpdateUserInfoDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserInfoMapper {
    //qna, proudct_review, review, user제외 예외처리 완료
    List<GetUserInfoDTO> getInfo(@Param("user_id") int user_id);

    void updateInfo(@Param("user_id") int user_id, @Param("updateDTO") UpdateUserInfoDTO updateDTO);

    void deleteInfo(@Param("user_id") int user_id);
}