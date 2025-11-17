package com.review.shop.service.userinfo.other;


import com.review.shop.dto.userinfo.others.Payment_MethodDTO;
import com.review.shop.repository.userinfo.other.Payment_MethodMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class Payment_MethodService {

    private final Payment_MethodMapper mapper;


    public List<Payment_MethodDTO> getAll(int user_id) {
        return mapper.findAllByUser(user_id);
    }

    public void create(Payment_MethodDTO dto) {
        // 중복 결제 수단 체크
        int exists = mapper.existsPayment(dto.getUser_id(), dto.getCard_number());
        if (exists > 0) {
            throw new IllegalArgumentException("이미 등록된 결제 수단입니다.");
        }
        mapper.insert(dto);
    }

    public void delete(int payment_id, int user_id) {
        // 삭제 전 해당 결제 수단이 user_id 소유인지 체크
        Payment_MethodDTO payment = mapper.findById(payment_id);
        if (payment == null) {
            throw new IllegalArgumentException("삭제할 결제 수단이 존재하지 않습니다.");
        }
        if (payment.getUser_id() != user_id) {
            throw new IllegalArgumentException("권한이 없는 결제 수단입니다.");
        }
        mapper.delete(payment_id, user_id);
    }

}