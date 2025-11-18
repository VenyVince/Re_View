package com.review.shop.controller.userinfo;


import com.review.shop.Util.Security_Util;
import com.review.shop.dto.userinfo.others.Payment_MethodDTO;
import com.review.shop.dto.userinfo.others.Payment_MethodResponseDTO;
import com.review.shop.service.userinfo.other.Payment_MethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/me/payments")
@RequiredArgsConstructor
public class Payment_MethodController {

    private final Payment_MethodService service;
    private final Security_Util securityUtil;


    @GetMapping
    public List<Payment_MethodResponseDTO> getAll() {
        int user_id = securityUtil.getCurrentUserId();
        return service.getAll(user_id);
    }

    // 새로운 결제수단 추가
    @PostMapping
    public void create(@RequestBody Payment_MethodDTO dto) {
        dto.setUser_id(securityUtil.getCurrentUserId());
        service.create(dto);
    }

    // 특정 삭제
    @DeleteMapping("/{payment_id}")
    public void delete(@PathVariable int payment_id) {
        int user_id = securityUtil.getCurrentUserId();
        service.delete(payment_id, user_id);
    }
}
