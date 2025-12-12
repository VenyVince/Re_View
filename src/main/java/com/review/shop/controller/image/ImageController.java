package com.review.shop.controller.image;

import com.review.shop.dto.image.ImageUrlResponseDTO;
import com.review.shop.image.ImageService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
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

    @PostMapping("/products/convert-datas")
    public ResponseEntity<List<ImageUrlResponseDTO>> getPresignedUrls(
            @RequestBody List<Map<String, String>> params
    ) {
        List<ImageUrlResponseDTO> responses = new ArrayList<>();

        for (Map<String, String> param : params) {
            String fileName = param.get("fileName");
            String folder = param.get("folder");

            ImageUrlResponseDTO response = imageService.presignedUrlPostWithDTO(folder, fileName);
            responses.add(response);
        }

        return ResponseEntity.ok(responses);
    }

    //모든 배너이미지 받기
    @Operation (summary = "배너 이미지들 가져오기", description = "배너 이미지들의 URL을 리스트로 반환합니다.")
    @GetMapping("/banners")
    public ResponseEntity<List<String>> getBannerImages() {
        List<String> bannerImageUrls = imageService.getBannerImageUrls();
        return ResponseEntity.ok(bannerImageUrls);
    }
}