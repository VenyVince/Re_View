package com.review.shop.service.userinfo.other;


import com.review.shop.dto.userinfo.others.Payment_MethodDTO;
import com.review.shop.dto.userinfo.others.Payment_MethodResponseDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.userinfo.other.Payment_MethodMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class Payment_MethodService {

    private final Payment_MethodMapper mapper;

    @Transactional
    public List<Payment_MethodResponseDTO> getAll(int user_id) {
        try {
            return mapper.findAllByUser(user_id);
        } catch (DataAccessException e) {
            throw new DatabaseException("결제수단 조회 중 DB 오류가 발생했습니다.", e);
        }
    }

    @Transactional
    public void create(Payment_MethodDTO dto) {
        try {
            int exists = mapper.existsPayment(dto.getUser_id(), dto.getCard_number(), dto.getCard_company());
            if (exists > 0) {
                throw new WrongRequestException("이미 등록된 결제 수단입니다.");
            }
            mapper.insert(dto);
        } catch (DataAccessException e) {
            throw new DatabaseException("결제수단 등록 중 DB 오류가 발생했습니다.", e);
        }
    }


    @Transactional
    public void delete(int payment_id, int user_id) {
        try {
            Payment_MethodDTO payment = mapper.findById(payment_id);
            if (payment == null) {
                throw new WrongRequestException("삭제할 결제 수단이 존재하지 않습니다.");
            }
            if (payment.getUser_id() != user_id) {
                throw new WrongRequestException("권한이 없는 결제 수단입니다.");
            }
            mapper.delete(payment_id, user_id);
        } catch (DataAccessException e) {
            throw new DatabaseException("결제수단 삭제 중 DB 오류가 발생했습니다.", e);
        }
    }

}
