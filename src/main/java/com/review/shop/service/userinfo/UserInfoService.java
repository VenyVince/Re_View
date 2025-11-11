package com.review.shop.service.userinfo;

import com.review.shop.dto.userinfo.UserInfoResponseDTO;
import com.review.shop.dto.userinfo.UserInfoUpdateDTO;
import com.review.shop.repository.userinfo.UserInfoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserInfoService {

    private final UserInfoMapper userInfoMapper;

    public UserInfoResponseDTO getUserInfo(String id) {
        return userInfoMapper.findById();
    }

    public void updateUserInfo(int user_id, UserInfoUpdateDTO updateDTO) {
        userInfoMapper.updateUser(user_id, updateDTO);
    }

    public void deleteUser(int user_id) {
        userInfoMapper.deleteUser(user_id);
    }
}
