package com.review.shop.repository.address;

import com.review.shop.dto.address.AddressDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface AddressMapper {
    List<AddressDTO> selectAddressList(int userId);
    AddressDTO selectAddressDetail(@Param("addressId") int addressId);

    int insertAddress(AddressDTO addressDTO);
    int updateAddress(AddressDTO addressDTO);
    int deleteAddress(@Param("addressId") int addressId, @Param("userId") int userId);

    // 특정 유저의 모든 배송지를 '일반'으로 초기화
    int resetDefaultAddress(int userId);
}