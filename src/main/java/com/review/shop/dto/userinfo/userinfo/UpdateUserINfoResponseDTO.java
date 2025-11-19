package com.review.shop.dto.userinfo.userinfo;

import lombok.Data;

import java.util.List;

@Data
public class UpdateUserINfoResponseDTO {
    private List<UpdateUserInfoDTO> userinfosUpdate;
}
