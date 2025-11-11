package com.review.shop.service.userinfo;

import com.review.shop.dto.userinfo.GetUserInfoDTO;
import com.review.shop.dto.userinfo.GetUserInfoResponseDTO;
import com.review.shop.dto.userinfo.UpdateUserINfoResponseDTO;
import com.review.shop.dto.userinfo.UpdateUserInfoDTO;
import com.review.shop.repository.UserIdMapper;
import com.review.shop.repository.userinfo.UserInfoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserInfoService {

    private final UserIdMapper userIdMapper;
    private final UserInfoMapper userInfoMapper;

    public int getUser_id(String id) {
        return userIdMapper.getUser_id(id);
    }

    public GetUserInfoResponseDTO getUserInfo(int user_id) {
        List<GetUserInfoDTO> userinfo = userInfoMapper.getInfo(user_id);
        GetUserInfoResponseDTO response = new GetUserInfoResponseDTO();
        response.setUserInfos(userinfo);
        return response;
    }

    public void updateUserInfo(int user_id, UpdateUserInfoDTO updateDTO) {
        userInfoMapper.updateInfo(user_id, updateDTO);
    }
}
