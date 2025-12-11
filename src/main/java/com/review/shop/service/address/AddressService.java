package com.review.shop.service.address;

import com.review.shop.dto.address.AddressDTO;
import com.review.shop.exception.DatabaseException;
import com.review.shop.exception.ResourceNotFoundException;
import com.review.shop.exception.WrongRequestException;
import com.review.shop.repository.address.AddressMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressMapper addressMapper;

    public List<AddressDTO> getMyAddresses(int user_id) {
        try {
            return addressMapper.selectAddressList(user_id);
        } catch (DataAccessException e) {
            throw new DatabaseException("배송지 목록 조회 실패", e);
        }
    }

    @Transactional
    public void registerAddress(AddressDTO addressDTO) {
        // 유효성 검사
        if (!"0".equals(addressDTO.getIs_default()) && !"1".equals(addressDTO.getIs_default())) {
            throw new WrongRequestException("is_default 값은 '0' 또는 '1'이어야 합니다.");
        }

        try {
            // 기본 배송지로 설정 시, 기존 것 초기화
            if ("1".equals(addressDTO.getIs_default())) {
                addressMapper.resetDefaultAddress(addressDTO.getUser_id());
            }
            addressMapper.insertAddress(addressDTO);
        } catch (DataAccessException e) {
            throw new DatabaseException("배송지 등록 중 DB 오류", e);
        }
    }

    @Transactional
    public void modifyAddress(AddressDTO addressDTO) {
        try {
            if ("1".equals(addressDTO.getIs_default())) {
                addressMapper.resetDefaultAddress(addressDTO.getUser_id());
            }

            int result = addressMapper.updateAddress(addressDTO);
            if (result == 0) {
                throw new ResourceNotFoundException("수정할 배송지가 없습니다. (권한 없음 또는 삭제됨)");
            }
        } catch (DataAccessException e) {
            throw new DatabaseException("배송지 수정 중 DB 오류", e);
        }
    }

    @Transactional
    public void removeAddress(int address_id, int user_id) {
        try {
            int result = addressMapper.deleteAddress(address_id, user_id);
            if (result == 0) {
                throw new ResourceNotFoundException("삭제할 배송지가 없습니다. (권한 없음 또는 이미 삭제됨)");
            }
        } catch (DataAccessException e) {
            throw new DatabaseException("배송지 삭제 중 DB 오류", e);
        }
    }
}