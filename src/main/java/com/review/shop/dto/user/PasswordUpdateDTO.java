package com.review.shop.dto.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PasswordUpdateDto {

    private String currentPassword;

    private String newPassword;

}