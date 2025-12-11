package com.review.shop.dto.image;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ImageUrlResponseDTO {
    private String objectKey;
    private String presignedUrl;
}
