package com.review.shop.service.userinfo;

import com.review.shop.dto.userinfo.GetUserInfoDTO;
import com.review.shop.dto.userinfo.GetUserInfoResponseDTO;
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
        GetUserInfoResponseDTO existingResponse = getUserInfo(user_id);
        GetUserInfoDTO existingUser = existingResponse.getUserInfos().get(0); // 단일 유저 기준

        // null이면 기존값 유지
        if(updateDTO.getNickname() == null) updateDTO.setNickname(existingUser.getNickname());
        if(updateDTO.getPhoneNumber() == null) updateDTO.setPhoneNumber(existingUser.getPhoneNumber());
        if(updateDTO.getBaumann_id()==null) updateDTO.setBaumann_id(existingUser.getBaumann_id());

        // Mapper 호출
        userInfoMapper.updateInfo(user_id, updateDTO);
    }

    public void deleteUserInfo(int user_id) {
        userInfoMapper.deleteInfo(user_id);
    }
}
