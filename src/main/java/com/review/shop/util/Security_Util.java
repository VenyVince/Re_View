package com.review.shop.Util;

import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.service.userinfo.UserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Security_Util {

    private final UserInfoService userInfoService;

    public int getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new WrongRequestException("로그인이 필요합니다.");
        }

        String id = authentication.getName();
        Integer user_id = userInfoService.getUser_id(id);

        if (user_id == null) {
            throw new ResourceNotFoundException("사용자 정보를 찾을 수 없습니다.");
        }

        return user_id;
    }


    public String getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new WrongRequestException("로그인이 필요합니다.");
        }

        String id = authentication.getName();
        String role = userInfoService.getUserRole(id); // user_id 대신 role 조회

        if (role == null || (!role.equals("USER") && !role.equals("ADMIN"))) {
            throw new ResourceNotFoundException("사용자 role이 정의된 것과 다르거나 null입니다.");
        }

        return role;
    }
}
