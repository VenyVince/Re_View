package com.review.shop.controller.address;

import com.review.shop.Util.Security_Util;
import com.review.shop.dto.address.AddressDTO;
import com.review.shop.service.address.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;
    private final Security_Util securityUtil;

    @Operation(summary = "내 배송지 목록 조회", description = "로그인한 사용자의 배송지 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패 (로그인 필요)"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @GetMapping
    public ResponseEntity<?> getMyAddresses() {
            int userId = securityUtil.getCurrentUserId();
            return ResponseEntity.ok(addressService.getMyAddresses(userId));
    }

    @Operation(summary = "새 배송지 추가", description = "새로운 배송지를 등록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "등록 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터"),
            @ApiResponse(responseCode = "401", description = "인증 실패 (로그인 필요)"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
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

    @Operation(summary = "배송지 수정", description = "본인의 배송지 정보를 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패 (로그인 필요)"),
            @ApiResponse(responseCode = "404", description = "배송지 없음 또는 권한 없음"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
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

    @Operation(summary = "배송지 삭제", description = "본인의 배송지 정보를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패 (로그인 필요)"),
            @ApiResponse(responseCode = "404", description = "배송지 없음 또는 권한 없음"),
            @ApiResponse(responseCode = "500", description = "서버(DB) 오류")
    })
    @DeleteMapping("/{addressId}")
    public ResponseEntity<String> deleteAddress(@PathVariable int addressId) {
            int userId = securityUtil.getCurrentUserId();

            addressService.removeAddress(addressId, userId);
            return ResponseEntity.ok("배송지 삭제 성공");
    }
}