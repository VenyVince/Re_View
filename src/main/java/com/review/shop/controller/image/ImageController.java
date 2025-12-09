package com.review.shop.controller.image;

import com.review.shop.dto.image.ImageUrlResponseDTO;
import com.review.shop.image.ImageService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    // presignedUrls로 변환 API
    @Operation(summary = "Presigned URL 반환", description = "여러 이미지의 Object Key를 받아 각각에 대한 Presigned URL을 반환합니다.")
    @PostMapping("/products/presigned-url")
    public ResponseEntity<ImageUrlResponseDTO> getPresignedUrl(@RequestBody Map<String, String> body) {

        // 본문에서 "fileName" 꺼내기
        String fileName = body.get("fileName");

        // 서비스 호출
        ImageUrlResponseDTO response = imageService.presignedUrlUpload(fileName);

        return ResponseEntity.ok(response);
    }
}