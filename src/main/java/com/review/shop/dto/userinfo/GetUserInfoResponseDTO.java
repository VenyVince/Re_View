package com.review.shop.dto.userinfo;

import lombok.Data;

import java.util.List;

@Data
public class GetUserInfoResponseDTO {
    List<GetUserInfoDTO> userInfos;
}
