package com.review.shop.service.userinfo;

import com.review.shop.dto.userinfo.GetUserInfoDTO;
import com.review.shop.dto.userinfo.GetUserInfoResponseDTO;
import com.review.shop.dto.userinfo.UpdateUserInfoDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.repository.UserIdMapper;
import com.review.shop.repository.userinfo.UserInfoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
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
        try {
            List<GetUserInfoDTO> userinfo = userInfoMapper.getInfo(user_id);
            if (userinfo.isEmpty()) {
                throw new ResourceNotFoundException("사용자 정보를 찾을 수 없습니다.");
            }
            GetUserInfoResponseDTO response = new GetUserInfoResponseDTO();
            response.setUserInfos(userinfo);
            return response;
        } catch (DataAccessException e) {
            throw new DatabaseException("회원 정보 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    public void updateUserInfo(int user_id, UpdateUserInfoDTO updateDTO) {
        try {
            GetUserInfoResponseDTO existingResponse = getUserInfo(user_id);
            GetUserInfoDTO existingUser = existingResponse.getUserInfos().get(0); // 단일 유저 기준

            // null이면 기존값 유지
            if(updateDTO.getNickname() == null) updateDTO.setNickname(existingUser.getNickname());
            if(updateDTO.getPhone_number() == null) updateDTO.setPhone_number(existingUser.getPhone_number());
            if(updateDTO.getBaumann_id() == null) updateDTO.setBaumann_id(existingUser.getBaumann_id());

            userInfoMapper.updateInfo(user_id, updateDTO);
        } catch (DataAccessException e) {
            throw new DatabaseException("회원 정보 수정 중 DB 오류가 발생했습니다.", e);
        }
    }

    public void deleteUserInfo(int user_id) {
        try {
            userInfoMapper.deleteInfo(user_id);
        } catch (DataAccessException e) {
            throw new DatabaseException("회원 탈퇴 중 DB 오류가 발생했습니다.", e);
        }
    }
}
