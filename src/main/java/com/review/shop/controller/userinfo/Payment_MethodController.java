package com.review.shop.controller.userinfo;


import com.review.shop.Util.Security_Util;
import com.review.shop.dto.userinfo.others.Payment_MethodDTO;
import com.review.shop.dto.userinfo.others.Payment_MethodResponseDTO;
import com.review.shop.service.userinfo.other.Payment_MethodService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Payments", description = "결제수단 CRD API")
@RestController
@RequestMapping("/api/users/me/payments")
@RequiredArgsConstructor
public class Payment_MethodController {

    private final Payment_MethodService service;
    private final Security_Util securityUtil;

    @Operation(summary = "결제수단 조회")
    @GetMapping
    public List<Payment_MethodResponseDTO> getAll() {
        int user_id = securityUtil.getCurrentUserId();
        return service.getAll(user_id);
    }

    @Operation(summary = "결제수단 추가")
    @PostMapping
    public void create(@RequestBody Payment_MethodDTO dto) {
        dto.setUser_id(securityUtil.getCurrentUserId());
        service.create(dto);
    }

    @Operation(summary = "결제수단 삭제", description = "특정 결제수단을 삭제합니다.")
    @DeleteMapping("/{payment_id}")
    public void delete(@PathVariable int payment_id) {
        int user_id = securityUtil.getCurrentUserId();
        service.delete(payment_id, user_id);
    }
}
