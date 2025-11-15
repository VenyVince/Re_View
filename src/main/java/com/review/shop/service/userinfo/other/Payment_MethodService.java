package com.review.shop.service.userinfo.other;


import com.review.shop.dto.userinfo.others.Payment_MethodDTO;
import com.review.shop.dto.userinfo.others.Payment_MethodResponseDTO;
import com.review.shop.repository.UserIdMapper;
import com.review.shop.repository.userinfo.other.Payment_MethodMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class Payment_MethodService {
    private final UserIdMapper userIdMapper;
    private final Payment_MethodMapper payment_MethodMapper;

    public int getUser_id(String id){return userIdMapper.getUser_id(id);}

    public Payment_MethodResponseDTO getPayment_Method(int user_id){
        List<Payment_MethodDTO> payments = payment_MethodMapper.getPayments(user_id);
        Payment_MethodResponseDTO response = new Payment_MethodResponseDTO();
        response.setPayment_methods(payments);
        return response;
    }

    public void addPayment_Method(int user_id, String card_company, String card_number){
        boolean exists = payment_MethodMapper.existsPayment(user_id, card_number);
        if (exists){
            throw new IllegalStateException("이미 등록된 카드입니다. 중복 등록은 혀용되지 않습니다.");
        }
        payment_MethodMapper.addPayment(user_id, card_company, card_number);
    }

    public void deletePayment_Method(int user_id, String card_company, String card_number, int payment_id){
        boolean exists = payment_MethodMapper.existsPayment(user_id, card_number);
        payment_MethodMapper.deletePayment(user_id, payment_id);
    }

    public void checkDefaultPayment(int user_id, int payment_id) {
        payment_MethodMapper.checkDefaultPayment(user_id, payment_id);
    }

}
