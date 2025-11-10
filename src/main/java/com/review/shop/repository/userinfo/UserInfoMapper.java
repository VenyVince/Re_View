package com.review.shop.repository.userinfo;

import com.review.shop.dto.userinfo.UserInfoResponseDTO;
import com.review.shop.dto.userinfo.UserInfoUpdateDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserInfoMapper {

    UserInfoResponseDTO findById(@Param("user_id") int user_id);

    void updateUser(@Param("user_id") int user_id,
                    @Param("updateDTO") UserInfoUpdateDTO updateDTO);

    void deleteUser(@Param("user_id") int user_id);
}
