package com.review.shop.repository.userinfo.other;

import com.review.shop.dto.userinfo.others.Payment_MethodDTO;
import com.review.shop.dto.userinfo.others.Payment_MethodResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface Payment_MethodMapper {

    // 전체 조회
    List<Payment_MethodResponseDTO> findAllByUser(int user_id);

    // 추가
    void insert(Payment_MethodDTO dto);

    // 삭제
    void delete(int payment_id, int user_id);


    // 중복 체크용
    Payment_MethodDTO findById(@Param("payment_id") int payment_id);
    int existsPayment(@Param("user_id") int user_id, @Param("card_number") String card_number);
}
