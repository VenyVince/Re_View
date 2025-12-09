package com.review.shop.controller.image;

import com.review.shop.dto.image.ImageUrlResponseDTO;
import com.review.shop.image.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping("/products/presigned-urls")
    public ResponseEntity<List<ImageUrlResponseDTO>> getPresignedUrls(@RequestBody List<String> objectKeys) {

        List<ImageUrlResponseDTO> responseList = objectKeys.stream()
                .map(key -> ImageUrlResponseDTO.builder()
                        .objectKey(key)
                        .presignedUrl(imageService.presignedUrlUpload(key))
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }
}