package com.review.shop.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class PasswordUpdateDTO {
    String currentPassword;
    String newPassword;
}
