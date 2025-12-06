package com.review.shop.image;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Tag(name = "Image Upload", description = "이미지 업로드 API")
public class ImageUploadController {
    //review이미지 및 product이미지 처리
    // C:\review\하위 폴더에 저장
    private final ImageService imageService;

    @Operation(
            summary = "리뷰 이미지 업로드 URL 발급",
            description = "이미지를 MinIO에 업로드할 수 있는 presigned URL을 JSON 요청으로 발급합니다. " +
                    "서버는 파일을 저장하지 않으며 클라이언트가 MinIO로 직접 업로드합니다." +
                    "presigned URL은 Put으로 Binary형태로 이미지를 업로드 해야합니다."
    )
    @PostMapping("/reviews")
    public ResponseEntity<?> getReviewUploadUrl(@RequestBody ImageRequestDTO request) {
        return ResponseEntity.ok(imageService.uploadReviewImages(request.getFile_name()));
    }

    @Operation(
            summary = "상품 이미지 업로드 URL 발급",
            description = "이미지를 MinIO에 업로드할 수 있는 presigned URL을 JSON 요청으로 발급합니다. " +
                    "서버는 파일을 저장하지 않으며 클라이언트가 MinIO로 직접 업로드합니다." +
                    "presigned URL은 Put으로 Binary형태로 이미지를 업로드 해야합니다."
    )
    @PostMapping("/products")
    public ResponseEntity<?> getProductUploadUrl(@RequestBody ImageRequestDTO request) {
        return ResponseEntity.ok(imageService.uploadProductImages(request.getFile_name()));
    }
}
