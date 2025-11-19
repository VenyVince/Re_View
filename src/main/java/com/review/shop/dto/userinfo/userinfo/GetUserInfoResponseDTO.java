package com.review.shop.dto.userinfo.userinfo;

import lombok.Data;

import java.util.List;

@Data
public class GetUserInfoResponseDTO {
    private List<GetUserInfoDTO> userInfos;
}
