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

        String username = authentication.getName();
        Integer user_id = userInfoService.getUser_id(username);

        if (user_id == null) {
            throw new ResourceNotFoundException("사용자 정보를 찾을 수 없습니다.");
        }

        return user_id;
    }
}
