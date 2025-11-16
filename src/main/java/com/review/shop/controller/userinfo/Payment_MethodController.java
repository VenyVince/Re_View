package com.review.shop.controller.userinfo;


import com.review.shop.Util.Security_Util;
import com.review.shop.dto.userinfo.others.Payment_MethodDTO;
import com.review.shop.dto.userinfo.others.Payment_MethodResponseDTO;
import com.review.shop.service.userinfo.other.Payment_MethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me/payments")
@RequiredArgsConstructor
public class Payment_MethodController {

    private final Payment_MethodService payment_methodService;
    private final Security_Util securityutil;

    @GetMapping
    public ResponseEntity<?> getPayments(@AuthenticationPrincipal UserDetails userDetails){
        int user_id = securityutil.getCurrentUserId();
        Payment_MethodResponseDTO payments = payment_methodService.getPayment_Method(user_id);
        return ResponseEntity.ok(payments);
    }

    @PutMapping
    public ResponseEntity<?> setPayments(@AuthenticationPrincipal UserDetails userDetails,
                                         @RequestBody Payment_MethodDTO setDefaultDTO
                                         ){
        int user_id = securityutil.getCurrentUserId();
        payment_methodService.checkDefaultPayment(user_id, setDefaultDTO.getPayment_id());
        return ResponseEntity.ok("기본 결제수단이 변경되었습니다.");
    }

    @PostMapping
    public ResponseEntity<?> addPayments(@AuthenticationPrincipal UserDetails userDetails,
                                         @RequestBody Payment_MethodDTO requestDTO){
        int user_id = securityutil.getCurrentUserId();
        payment_methodService.addPayment_Method(user_id, requestDTO.getCard_company(), requestDTO.getCard_number());
        return ResponseEntity.ok("결제수단이 추가 되었습ㄴ디ㅏ.");
    }

    @DeleteMapping
    public ResponseEntity<?> deletePayments(@AuthenticationPrincipal UserDetails userDetails,
                                            @RequestBody Payment_MethodDTO deleteDTO){
        int user_id = securityutil.getCurrentUserId();
        payment_methodService.deletePayment_Method(user_id, deleteDTO.getCard_company(), deleteDTO.getCard_number(), deleteDTO.getPayment_id());
        return ResponseEntity.ok("결제수단이 삭제되었습니다.");
    }
}
