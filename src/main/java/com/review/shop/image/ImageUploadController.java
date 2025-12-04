package com.review.shop.image;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Tag(name = "Image Upload", description = "이미지 업로드 API")
public class ImageUploadController {
    //review이미지 및 product이미지 처리
    // C:\review\하위 폴더에 저장
    private final ImageService imageService;

    @Operation(summary = "리뷰 이미지 업로드", description = "리뷰 이미지를 최대 5개까지 업로드합니다. Json방식 아니고 이미지만 Form Data형식으로 통신입니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "이미지 업로드 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (WrongRequestException)"),
            @ApiResponse(responseCode = "500", description = "파일 처리 오류 (FileProcessingException)")
    })
    @PostMapping("/reviews")
    public ResponseEntity<?> uploadReviewImage(@RequestParam("file_name") String file_name) {
        return ResponseEntity.ok(imageService.uploadReviewImages(file_name));

    }

    @Operation(summary = "상품 이미지 업로드", description = "상품 이미지를 업로드합니다. Json방식 아니고 이미지만 Form Data형식으로 통신입니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "이미지 업로드 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (WrongRequestException)"),
            @ApiResponse(responseCode = "500", description = "파일 처리 오류 (FileProcessingException)")
    })
    @PostMapping("/products")
    public ResponseEntity<?> uploadProductImage(@RequestParam("file_name") String file_name) {
        return ResponseEntity.ok(imageService.uploadProductImages(file_name));
    }
}
