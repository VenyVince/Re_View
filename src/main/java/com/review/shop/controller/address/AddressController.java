package com.review.shop.controller.address;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.address.AddressDTO;
import com.review.shop.service.address.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;
    private final Security_Util securityUtil;

    @Operation(summary = "내 배송지 목록 조회")
    @GetMapping
    public ResponseEntity<?> getMyAddresses() {
            int userId = securityUtil.getCurrentUserId();
            return ResponseEntity.ok(addressService.getMyAddresses(userId));
    }

    @Operation(summary = "새 배송지 추가")
    @PostMapping
    public ResponseEntity<String> createAddress(@RequestBody AddressDTO addressDTO) {
            int userId = securityUtil.getCurrentUserId();
            addressDTO.setUser_id(userId);

            // 기본값 설정 (프론트에서 안 보내줬을 경우)
            if (addressDTO.getIs_default() == null || addressDTO.getIs_default().isEmpty()) {
                addressDTO.setIs_default("0");
            }
            if (addressDTO.getAddress_name() == null || addressDTO.getAddress_name().isEmpty()) {
                addressDTO.setAddress_name("배송지");
            }
            addressService.registerAddress(addressDTO);
            return ResponseEntity.ok("배송지 추가 성공");
    }

    @Operation(summary = "배송지 수정")
    @PatchMapping("/{addressId}")
    public ResponseEntity<String> updateAddress(
            @PathVariable int addressId,
            @RequestBody AddressDTO addressDTO
    ) {
            int userId = securityUtil.getCurrentUserId();

            addressDTO.setAddress_id(addressId);
            addressDTO.setUser_id(userId);

            addressService.modifyAddress(addressDTO);
            return ResponseEntity.ok("배송지 수정 성공");
    }

    @Operation(summary = "배송지 삭제")
    @DeleteMapping("/{addressId}")
    public ResponseEntity<String> deleteAddress(@PathVariable int addressId) {
            int userId = securityUtil.getCurrentUserId();

            addressService.removeAddress(addressId, userId);
            return ResponseEntity.ok("배송지 삭제 성공");
    }
}