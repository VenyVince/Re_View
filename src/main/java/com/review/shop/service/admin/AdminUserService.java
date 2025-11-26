package com.review.shop.service.admin;

import com.review.shop.dto.user.UserSummaryDTO;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.admin.AdminUserMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class AdminUserService {

    private final AdminUserMapper adminUserMapper;


    // 포인트 조회
    public Integer getMemberPoints(int user_id) {
        Integer points = adminUserMapper.getMemberPoints(user_id);
        if (points == null) {
            throw new ResourceNotFoundException("포인트 정보를 찾을 수 없습니다.");
        }
        return points;
    }

    public void updateMemberPoints(int user_id, Integer points) {
        if (points == null || points < 0) {
            throw new WrongRequestException("포인트는 0 이상이어야 합니다.");
        }
        int affected = adminUserMapper.updateMemberPoints(user_id, points);
        if (affected == 0) {
            throw new ResourceNotFoundException("포인트를 수정할 회원을 찾을 수 없습니다.");
        }
    }



    public List<UserSummaryDTO> getAllusers() {
        if(adminUserMapper.getAllusers() == null){
            throw new ResourceNotFoundException( "사용자 정보를 찾을 수 없습니다.");
        }

        return adminUserMapper.getAllusers();
    }

    // 밴 기록 추가
    public void setBan(int user_id, String reason) {

        int result = adminUserMapper.setBlacklist(user_id, reason);

        if(result == 0){
            throw new ResourceNotFoundException("밴 기록에 실패했습니다. 해당 사용자를 찾을 수 없습니다.");
        }
    }

    // 유저 탈퇴처리
    public void deleteUser(int user_id) {
        int result = adminUserMapper.deleteUser(user_id);

        if(result == 0){
            throw new ResourceNotFoundException("사용자 삭제에 실패했습니다. 해당 사용자를 찾을 수 없습니다.");
        }
    }

    // 유저의 밴 처리, 밴 기록 처리 트랜잭션
    @Transactional
    public void blockAndExpelUser(int user_id, String reason) {
        setBan(user_id, reason);
        deleteUser(user_id);
    }
}
