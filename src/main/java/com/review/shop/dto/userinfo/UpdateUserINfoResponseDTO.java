package com.review.shop.dto.userinfo;

import lombok.Data;

import java.util.List;

@Data
public class UpdateUserINfoResponseDTO {
    List<UpdateUserInfoDTO> userinfosUpdate;
}
