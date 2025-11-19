package com.review.shop.controller;

import com.review.shop.Util.FileUploadProperties;
import com.review.shop.Util.Security_Util;
import com.review.shop.exception.FileProcessingException;
import com.review.shop.exception.WrongRequestException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Tag(name = "Image Upload", description = "이미지 업로드 API")
public class ImageUploadController {
    //review이미지 및 product이미지 처리

//    C:\review_user\reviews\UUID.png 로 저장
    private final FileUploadProperties fileUploadProperties;
    private final Security_Util security_util;

    @PostMapping("/reviews")
    @Operation(summary = "리뷰 이미지 업로드", description = "리뷰 이미지를 최대 5개까지 업로드합니다")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "이미지 업로드 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (WrongRequestException)"),
            @ApiResponse(responseCode = "500", description = "파일 처리 오류 (FileProcessingException)")
    })
    public ResponseEntity<List<String>> uploadImages(@RequestParam("images") MultipartFile[] images) {

        if (images.length > 5) {
            throw new WrongRequestException("이미지는 최대 5개까지만 업로드 가능합니다");
        }

        // 현재 로그인한 사용자 role 조회
        String role = security_util.getCurrentUserRole(); // "USER" or "ADMIN"

        // 업로드 경로 결정
        String uploadDir = role.equalsIgnoreCase("ADMIN")
                ? fileUploadProperties.getAdminDir() + "uploads/reviews/"
                : fileUploadProperties.getUserDir() + "reviews/";

        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile image : images) {
            imageUrls.add(saveImage(image, uploadDir));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(imageUrls);
    }

    private String saveImage(MultipartFile image, String uploadDir) {

        try {
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs(); // 폴더 없으면 생성

            String originalFileName = image.getOriginalFilename();
            if (originalFileName == null || originalFileName.isEmpty()) {
                throw new WrongRequestException("파일 이름이 없습니다");
            }

            // 확장자 추출
            String ext = ".jpg";
            int dotIdx = originalFileName.lastIndexOf(".");
            if (dotIdx > 0 && dotIdx < originalFileName.length() - 1) {
                ext = originalFileName.substring(dotIdx);
            }

            String savedFileName = UUID.randomUUID().toString() + ext;
            File savedFile = new File(uploadDir + savedFileName);
            image.transferTo(savedFile);

            // 클라이언트에 반환할 URL
            return "/uploads/reviews/" + savedFileName;

        } catch (IOException e) {
            throw new FileProcessingException("이미지 저장 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
