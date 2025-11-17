package com.review.shop.repository.userinfo.other;

import com.review.shop.dto.userinfo.others.Payment_MethodDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface Payment_MethodMapper {
    List<Payment_MethodDTO> getPayments(@Param("user_id") int user_id);

    boolean existsPayment(@Param("user_id") int user_id,
                          @Param("card_number") String card_number);

    void addPayment(@Param("user_id") int user_id,
                    @Param("card_company") String card_company,
                    @Param("card_number") String card_number);

    void checkDefaultPayment(@Param("user_id") int user_id,
                             @Param("payment_id") int payment_id);

    void deletePayment(@Param("user_id") int user_id,
                       @Param("payment_id") int payment_id);
}
