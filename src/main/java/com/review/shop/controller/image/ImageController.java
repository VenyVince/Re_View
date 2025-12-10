package com.review.shop.controller.image;

import com.review.shop.dto.image.ImageUrlResponseDTO;
import com.review.shop.image.ImageService;
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

    //이미지들 업로드를 위해 presigned url과 object key를 반환하는 API
    //파라미터로는 fileName(파일명)을 받음

    @PostMapping("/products/convert-data")
    public ResponseEntity<ImageUrlResponseDTO> getPresignedUrl(
            @RequestBody Map<String, String> params
    ) {
        String fileName = params.get("fileName");
        String folder = params.get("folder");


        ImageUrlResponseDTO response = imageService.presignedUrlPostWithDTO(folder, fileName);

        return ResponseEntity.ok(response);
    }
}